import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createReportSchema } from "@/lib/schema";
import { extractMetrics } from "@/lib/report-metrics";
import { getAppSettings } from "@/lib/settings";

// POST /api/reports — guarda o actualiza un reporte finalizado
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const settings = await getAppSettings();
  const dynamicSchema = createReportSchema(settings);
  const parsed = dynamicSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Schema inválido", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  const metrics = extractMetrics(parsed.data, session.user.email);

  try {
    const report = await prisma.report.upsert({
      where: { fecha_turno: { fecha: metrics.fecha, turno: metrics.turno } },
      create: metrics,
      update: {
        ...metrics,
        updatedAt: new Date(),
      },
      select: { id: true, createdAt: true, updatedAt: true },
    });
    return NextResponse.json(report, { status: 200 });
  } catch (err) {
    console.error("[POST /api/reports]", err);
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}

// GET /api/reports — lista paginada con filtros
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const turno = searchParams.get("turno") ?? undefined;
  const supervisor = searchParams.get("supervisor") ?? undefined;
  const desde = searchParams.get("desde") ?? undefined;
  const hasta = searchParams.get("hasta") ?? undefined;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10)));

  const where = {
    ...(turno ? { turno } : {}),
    ...(supervisor ? { supervisor } : {}),
    ...(desde || hasta
      ? {
          fecha: {
            ...(desde ? { gte: desde } : {}),
            ...(hasta ? { lte: hasta } : {}),
          },
        }
      : {}),
  };

  try {
    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        orderBy: [{ fecha: "desc" }, { turno: "asc" }],
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          createdAt: true,
          fecha: true,
          turno: true,
          supervisor: true,
          userEmail: true,
          emailSent: true,
          molino3HorasMarcha: true,
          molino3RendimientoHora: true,
          molino3CuerposMoliendaKG: true,
          stockBarroArena: true,
          stockBarroRecupero: true,
          salaControlMoldesColados: true,
          maduracionMoldesEnSala: true,
          maduracionCaloventoresTemp: true,
          precuradoMoldesPreCurado: true,
          precuradoMoldesATC2: true,
          desmoldeMoldesMaquina: true,
          desmoldeMoldesManual: true,
          scrapParcialPct: true,
          transformacionTotalPallets: true,
          cantidadAusentes: true,
          tieneIncidentes: true,
          tieneAccidentes: true,
        },
      }),
      prisma.report.count({ where }),
    ]);

    return NextResponse.json({ reports, total, page, limit });
  } catch (err) {
    console.error("[GET /api/reports]", err);
    return NextResponse.json({ error: "Error al consultar" }, { status: 500 });
  }
}
