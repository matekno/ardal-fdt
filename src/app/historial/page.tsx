import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { HistorialView } from "./components/HistorialView";

const LIMIT = 50;

const SELECT = {
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
} as const;

export default async function HistorialPage({
  searchParams,
}: {
  searchParams: Promise<{
    turno?: string;
    supervisor?: string;
    desde?: string;
    hasta?: string;
    page?: string;
  }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const params = await searchParams;
  const turno = params.turno || undefined;
  const supervisor = params.supervisor || undefined;
  const desde = params.desde || undefined;
  const hasta = params.hasta || undefined;
  const page = Math.max(1, parseInt(params.page || "1", 10));

  const where = {
    ...(turno ? { turno } : {}),
    ...(supervisor ? { supervisor } : {}),
    ...((desde || hasta)
      ? {
          fecha: {
            ...(desde ? { gte: desde } : {}),
            ...(hasta ? { lte: hasta } : {}),
          },
        }
      : {}),
  };

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      orderBy: [{ fecha: "desc" }, { turno: "asc" }],
      skip: (page - 1) * LIMIT,
      take: LIMIT,
      select: SELECT,
    }),
    prisma.report.count({ where }),
  ]);

  return (
    <HistorialView
      reports={reports}
      total={total}
      page={page}
      limit={LIMIT}
      filters={{ turno, supervisor, desde, hasta }}
    />
  );
}
