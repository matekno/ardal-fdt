import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getAppSettings } from "@/lib/settings";
import { HistorialView } from "./components/HistorialView";
import type { ReportRow } from "./components/HistorialView";

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

const TURNO_DESC: Record<string, number> = {
  "TURNO NOCHE": 3,
  "TURNO TARDE": 2,
  "TURNO MAÑANA": 1,
};

function compareReportsDesc(a: ReportRow, b: ReportRow) {
  const byDate = b.fecha.localeCompare(a.fecha);
  if (byDate !== 0) return byDate;
  return (TURNO_DESC[b.turno] ?? 0) - (TURNO_DESC[a.turno] ?? 0);
}

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
  const offset = (page - 1) * LIMIT;

  const [allReports, settings] = await Promise.all([
    prisma.report.findMany({
      where,
      orderBy: [{ fecha: "desc" }],
      select: SELECT,
    }),
    getAppSettings(),
  ]);
  const sortedReports = (allReports as ReportRow[]).sort(compareReportsDesc);
  const reports = sortedReports.slice(offset, offset + LIMIT);
  const total = sortedReports.length;

  return (
    <HistorialView
      reports={reports}
      total={total}
      page={page}
      limit={LIMIT}
      filters={{ turno, supervisor, desde, hasta }}
      supervisores={settings.supervisores}
      turnos={settings.turnos}
      objetivoMoldesColados={settings.objetivoMoldesColados}
      objetivoRendimientoHora={settings.objetivoRendimientoHora}
    />
  );
}
