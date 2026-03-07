import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateReportsXlsx } from "@/lib/excel-export";
import type { Report } from "@/lib/schema";

// GET /api/reports/export — devuelve .xlsx con todos los campos JSONB
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

  const reports = await prisma.report.findMany({
    where,
    orderBy: [{ fecha: "desc" }, { turno: "asc" }],
    take: 500,
    select: {
      id: true,
      createdAt: true,
      fecha: true,
      turno: true,
      supervisor: true,
      userEmail: true,
      emailSent: true,
      data: true,
    },
  });

  const reportsWithData = reports.map((r) => ({
    ...r,
    data: r.data as unknown as Report,
  }));

  const buffer = generateReportsXlsx(reportsWithData);

  const date = new Date().toISOString().slice(0, 10);
  const filename = `reportes-fdt-${date}.xlsx`;

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
