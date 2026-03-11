import * as XLSX from "xlsx";
import type { Report, OrdenItem, AjustadasDetalle } from "@/lib/schema";

// ── Tipo de reporte completo (campos indexados + JSONB) ──

export type ReportWithData = {
  id: string;
  createdAt: Date;
  fecha: string;
  turno: string;
  supervisor: string;
  userEmail: string;
  emailSent: boolean;
  data: Report;
};

// ── Helpers de serialización ──

function s(val: string | null | undefined): string {
  return val?.trim() ?? "";
}

function n(val: number | null | undefined): number | string {
  return val ?? "";
}

function bool(val: boolean): string {
  return val ? "Sí" : "No";
}

/** Serializa array de ordenItemSchema: "3 | 7 | 2" o "" */
function ordenArr(items: OrdenItem[]): string {
  const vals = items.map((i) => i.valor).filter((v) => v !== null && v !== undefined);
  return vals.join(" | ");
}

/** Serializa ajustadasDetalleSchema */
function ajustadas(a: AjustadasDetalle): string {
  if (!a.activo) return "";
  const parts = [a.signo, a.cantidad != null ? String(a.cantidad) : "", a.medida].filter(Boolean);
  return parts.join(" ");
}

// ── Flatten de un reporte a fila plana ──

function flattenReport(r: ReportWithData): Record<string, string | number | Date> {
  const d = r.data;
  const p = d.personal;
  const m3 = d.molino3;
  const sb = d.stockBarro;
  const sc = d.salaControl;
  const mad = d.maduracion;
  const corte = d.corteDesmantelado;
  const rot = d.rotador;
  const prec = d.precuradoAutoclaves;
  const cal = d.caldera;
  const des = d.desmolde;
  const gran = d.granallado;
  const scrap = d.scrap;
  const tx = d.transformacion;
  const auto = d.autoelevadores;

  return {
    // ── ENCABEZADO ──
    "Fecha": r.fecha,
    "Turno": r.turno,
    "Supervisor": r.supervisor,
    "Email": r.userEmail,
    "Fecha Creación": r.createdAt.toISOString().slice(0, 16).replace("T", " "),
    "Email Enviado": bool(r.emailSent),

    // ── GENERAL ──
    "No Cumplimiento": s(d.general.explicacionNoCumplimiento),
    "General - Comentarios": s(d.general.otrosComentarios),

    // ── PERSONAL ──
    "Accidentes": s(p.accidentes),
    "Incidentes": s(p.incidentes),
    "Cant. Ausentes": n(p.cantidadAusentes),
    "Ausentes": p.ausentes.map((a) => `${a.nombre} (${a.motivo})`).join("\n"),
    "Comentario Ausentes": s(p.comentarioAusentes),
    "Cambios de Puesto": p.cambiosPuesto.map((c) => `${c.personal} → ${c.puesto}`).join("\n"),
    "Horas Extras": p.horasExtras.map((h) => `${h.personal} (${h.desdeHora}–${h.hastaHora})`).join("\n"),
    "Permisos": p.permisos.map((pe) => `${pe.personal} — ${pe.motivo}`).join("\n"),
    "Dev. Horas - Cant.": n(p.devolucionHoras.cantidad),
    "Dev. Horas - Lista": p.devolucionHoras.lista.map((l) => `${l.personal} (${l.desdeHora}–${l.hastaHora})`).join("\n"),
    "Personal Nuevo - Cant.": n(p.personalNuevo.cantidad),
    "Personal Nuevo - Lista": p.personalNuevo.lista.map((l) => `${l.personal} → ${l.puesto}`).join("\n"),
    "Vacaciones": p.vacaciones.map((v) => v.personal).join("\n"),
    "Capacitación": p.capacitacion.map((c) => `${c.personal} — ${c.capacitacion}`).join("\n"),
    "Personal - Otros": s(p.otrosComentarios),

    // ── MOLINO 3 ──
    "M3 Hs Marcha": n(m3.horasMarcha),
    "M3 Rendimiento/h (CM)": n(m3.rendimientoHora),
    "M3 Cuerpos Molienda (KG)": n(m3.cuerposMoliendaKG),
    "M3 Causa Bajo Rendimiento": s(m3.causaBajoRendimiento),
    "M3 Agua en Uso": s(m3.aguaEnUso),
    "M3 Mantenimiento": s(m3.mantenimiento),
    "M3 Limpieza": s(m3.limpieza),

    // ── STOCK BARRO ──
    "Stock Arena (MT)": n(sb.arena),
    "Stock Recupero (MT)": n(sb.recupero),
    "Stock Comentarios": s(sb.comentarios),
    "Stock Demoras": s(sb.demoras),

    // ── SALA CONTROL ──
    "SC Hora Inicio": s(sc.horaInicio),
    "SC Moldes Colados": n(sc.moldesColados),
    "SC Dintel Colado": ordenArr(sc.dintelColado),
    "SC Cambio Cemento": ordenArr(sc.cambioCemento),
    "SC Cambio Cal": ordenArr(sc.cambioCal),
    "SC Pruebas/Ensayos": s(sc.pruebasEnsayos),
    "SC Demoras": s(sc.demoras),
    "SC Mantenimiento": s(sc.mantenimiento),
    "SC Limpieza": s(sc.limpieza),
    "SC Otros": s(sc.otros),

    // ── MADURACIÓN ──
    "Mad Moldes en Sala": n(mad.moldesEnSala),
    "Mad Caloventores Modo": s(mad.caloventoresModo),
    "Mad Temp °C": n(mad.caloventoresTemp),
    "Mad Cambio Nylon": ordenArr(mad.cambioNylon),
    "Mad Molde Pinchado": ordenArr(mad.moldePinchado),
    "Mad Molde Fisurado": ordenArr(mad.moldeFisurado),
    "Mad Demoras": s(mad.demoras),
    "Mad Mantenimiento": s(mad.mantenimiento),
    "Mad Limpieza": s(mad.limpieza),
    "Mad Comentarios": s(mad.comentarios),

    // ── CORTE / DESMANTELADO ──
    "Corte Dintel Cortado": ordenArr(corte.dintelCortado),
    "Corte Molde Fisurado": ordenArr(corte.moldeFisurado),
    "Corte Demoras": s(corte.demoras),
    "Corte Mantenimiento": s(corte.mantenimiento),
    "Corte Limpieza": s(corte.limpieza),
    "Corte Comentarios": s(corte.comentarios),

    // ── ROTADOR ──
    "Rot Arrastre Nylon": ordenArr(rot.arrastreNylon),
    "Rot Molde Fisurado": ordenArr(rot.moldeFisurado),

    // ── PRECURADO / AUTOCLAVES ──
    "Prec Moldes Precurado": n(prec.moldesPreCurado),
    "Prec Moldes ATC2": n(prec.moldesATC2),
    "Prec Moldes en Vías": n(prec.moldesEnVias),
    "Prec Demoras": s(prec.demoras),
    "Prec Mantenimiento": s(prec.mantenimiento),
    "Prec Limpieza": s(prec.limpieza),
    "Prec Comentarios": s(prec.comentarios),

    // ── CALDERA ──
    "Cal Demoras": s(cal.demoras),
    "Cal Mantenimiento": s(cal.mantenimiento),
    "Cal Limpieza": s(cal.limpieza),
    "Cal Comentarios": s(cal.comentarios),

    // ── DESMOLDE ──
    "Des Moldes Máquina": n(des.moldesMaquina),
    "Des Moldes Manual": n(des.moldesManual),
    "Des Dintel Desmoldado": ordenArr(des.dintelDesmoldado),
    "Des Falla Aspiración": ordenArr(des.fallaAspiracion),
    "Des Fuera de Medida": ordenArr(des.fueraMedida),
    "Des Ajustadas 1era": ajustadas(des.ajustadas1era),
    "Des Ajustadas Reproceso": ajustadas(des.ajustadasReproceso),
    "Des Demoras": s(des.demoras),
    "Des Mantenimiento": s(des.mantenimiento),
    "Des Limpieza": s(des.limpieza),
    "Des Comentarios": s(des.comentarios),

    // ── GRANALLADO ──
    "Gran Planchas Granalladas": n(gran.planchasGranalladas),
    "Gran Demoras": s(gran.demoras),
    "Gran Mantenimiento": s(gran.mantenimiento),
    "Gran Limpieza": s(gran.limpieza),
    "Gran Comentarios": s(gran.comentarios),

    // ── SCRAP ──
    "Scrap Cerrado %": n(scrap.cerradoPct),
    "Scrap Parcial %": n(scrap.parcialPct),
    "Scrap Moldes Pendientes": n(scrap.moldesPendientes),

    // ── TRANSFORMACIÓN x15 ──
    "TX x15 Pallets UNA": n(tx.x15.palletsUNA),
    "TX x15 Pallets UEX": n(tx.x15.palletsUEX),
    "TX x15 Pallets O": n(tx.x15.palletsO),
    "TX x15 Pallets OExport": n(tx.x15.palletsOExport),
    "TX x15 Cortados 45°": n(tx.x15.cortados45),
    "TX x15 VE": n(tx.x15.ve),
    "TX x15 Descarte": n(tx.x15.descarte),

    // ── TRANSFORMACIÓN x175 ──
    "TX x175 Pallets UNA": n(tx.x175.palletsUNA),
    "TX x175 Pallets UEX": n(tx.x175.palletsUEX),
    "TX x175 Pallets O": n(tx.x175.palletsO),
    "TX x175 Pallets OExport": n(tx.x175.palletsOExport),
    "TX x175 Cortados 45°": n(tx.x175.cortados45),
    "TX x175 VE": n(tx.x175.ve),
    "TX x175 Descarte": n(tx.x175.descarte),

    // ── TRANSFORMACIÓN x20 ──
    "TX x20 Pallets UNA": n(tx.x20.palletsUNA),
    "TX x20 Pallets UEX": n(tx.x20.palletsUEX),
    "TX x20 Pallets O": n(tx.x20.palletsO),
    "TX x20 Pallets OExport": n(tx.x20.palletsOExport),
    "TX x20 Cortados 45°": n(tx.x20.cortados45),
    "TX x20 VE": n(tx.x20.ve),
    "TX x20 Descarte": n(tx.x20.descarte),

    // ── TRANSFORMACIÓN x25 ──
    "TX x25 Pallets UNA": n(tx.x25.palletsUNA),
    "TX x25 Pallets UEX": n(tx.x25.palletsUEX),
    "TX x25 Pallets O": n(tx.x25.palletsO),
    "TX x25 Pallets OExport": n(tx.x25.palletsOExport),
    "TX x25 Cortados 45°": n(tx.x25.cortados45),
    "TX x25 VE": n(tx.x25.ve),
    "TX x25 Descarte": n(tx.x25.descarte),

    // ── TRANSFORMACIÓN general ──
    "TX Demoras": s(tx.demoras),
    "TX Mantenimiento": s(tx.mantenimiento),
    "TX Limpieza": s(tx.limpieza),
    "TX Comentarios": s(tx.comentarios),

    // ── AUTOELEVADORES ──
    "Autoelevadores": auto.lista.map((a) => `${a.operador} (${a.desdeHora}–${a.hastaHora})`).join("\n"),

    // ── RESUMEN MANTENIMIENTO ──
    "Resumen Mantenimiento": d.resumenMantenimiento
      .map((rm) => `${rm.area}: ${rm.texto}`)
      .join("\n"),
  };
}

// ── Generación del workbook xlsx ──

export function generateReportsXlsx(reports: ReportWithData[]): Buffer {
  const rows = reports.map(flattenReport);

  const ws = XLSX.utils.json_to_sheet(rows);

  // Ajustar anchos de columna: texto largo = 40, numéricos = 14, default = 20
  const wideTextCols = new Set([
    "Supervisor", "Ausentes", "Cambios de Puesto", "Horas Extras", "Permisos",
    "Dev. Horas - Lista", "Personal Nuevo - Lista", "Vacaciones", "Capacitación",
    "Accidentes", "Incidentes", "No Cumplimiento", "General - Comentarios",
    "M3 Causa Bajo Rendimiento", "Stock Comentarios", "Stock Demoras",
    "SC Pruebas/Ensayos", "SC Demoras", "SC Mantenimiento", "SC Limpieza", "SC Otros",
    "Mad Demoras", "Mad Mantenimiento", "Corte Demoras", "Corte Mantenimiento",
    "Prec Demoras", "Prec Mantenimiento", "Cal Demoras", "Cal Mantenimiento",
    "Des Demoras", "Des Mantenimiento", "Gran Demoras", "Gran Mantenimiento",
    "TX Demoras", "TX Mantenimiento", "TX Comentarios",
    "Resumen Mantenimiento", "Personal - Otros",
  ]);

  const colKeys = Object.keys(rows[0] ?? {});
  ws["!cols"] = colKeys.map((key) => ({
    wch: wideTextCols.has(key) ? 40 : 16,
  }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Historial FDT");

  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
}
