import type { Prisma } from "@/generated/prisma";
import type { Report } from "@/lib/schema";

/**
 * Extrae los campos normalizados de un Report para guardar en la DB.
 * Los campos `reqNum` del schema Zod son obligatorios y van como columnas indexadas.
 * Los derivados (total pallets, flags de incidentes) se calculan acá.
 */
export function extractMetrics(report: Report, userEmail: string) {
  const t = report.transformacion;
  const sizes = [t.x15, t.x175, t.x20, t.x25];
  const transformacionTotalPallets = sizes.reduce((sum, s) => {
    return (
      sum +
      (s.palletsUNA ?? 0) +
      (s.palletsUEX ?? 0) +
      (s.palletsO ?? 0) +
      (s.palletsOExport ?? 0)
    );
  }, 0);

  return {
    fecha: report.encabezado.fecha,
    turno: report.encabezado.turno,
    supervisor: report.encabezado.supervisor,
    userEmail,

    molino3HorasMarcha: report.molino3.horasMarcha,
    molino3RendimientoHora: report.molino3.rendimientoHora,
    molino3CuerposMoliendaKG: report.molino3.cuerposMoliendaKG,
    stockBarroArena: report.stockBarro.arena,
    stockBarroRecupero: report.stockBarro.recupero,
    salaControlMoldesColados: report.salaControl.moldesColados,
    maduracionMoldesEnSala: report.maduracion.moldesEnSala,
    maduracionCaloventoresTemp: report.maduracion.caloventoresTemp,
    precuradoMoldesPreCurado: report.precuradoAutoclaves.moldesPreCurado,
    precuradoMoldesATC2: report.precuradoAutoclaves.moldesATC2,
    desmoldeMoldesMaquina: report.desmolde.moldesMaquina,
    desmoldeMoldesManual: report.desmolde.moldesManual,
    scrapParcialPct: report.scrap.parcialPct,

    transformacionTotalPallets,
    cantidadAusentes: report.personal.ausentes?.length ?? null,
    tieneIncidentes: !!report.personal.incidentes?.trim(),
    tieneAccidentes: !!report.personal.accidentes?.trim(),

    data: report as unknown as Prisma.InputJsonValue,
  };
}
