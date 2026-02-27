/**
 * Generador de email HTML para reportes FDT
 */

import type { Report, OrdenItem } from "./schema";
import { OBJETIVO_MOLDES_COLADOS } from "./constants";

export function generateEmailHTML(report: Report): string {
  const turnoShort = report.encabezado.turno.replace("TURNO ", "");
  const sections: string[] = [];

  // ── Sección GENERAL ──
  if (
    hd(report.general.explicacionNoCumplimiento) ||
    hd(report.general.otrosComentarios)
  ) {
    const rows: string[] = [];
    rows.push(
      txtRow(
        "No cumplimiento de objetivos",
        report.general.explicacionNoCumplimiento
      )
    );
    rows.push(txtRow("Otros comentarios", report.general.otrosComentarios));
    sections.push(section("General", rows));
  }

  // ── Sección PERSONAL ──
  const p = report.personal;
  const pRows: string[] = [];
  pRows.push(valRow("Accidentes", p.accidentes));
  pRows.push(valRow("Incidentes", p.incidentes));
  if (p.ausentes.length > 0) {
    pRows.push(valRow("Cantidad ausentes", p.cantidadAusentes));
    for (const a of p.ausentes) {
      const motivo = a.motivo ? ` — ${a.motivo}` : "";
      pRows.push(valRow("Ausente", `${a.nombre}${motivo}`));
    }
    pRows.push(txtRow("Comentario", p.comentarioAusentes));
  }
  if (p.cambiosPuesto.length > 0) {
    pRows.push(subHeader("Cambios de puesto"));
    for (const c of p.cambiosPuesto) {
      pRows.push(valRow(c.personal, c.puesto));
    }
  }
  if (p.horasExtras.length > 0) {
    pRows.push(subHeader("Banco de Horas"));
    for (const h of p.horasExtras) {
      pRows.push(
        valRow(h.personal, `${h.desdeHora} → ${h.hastaHora}`)
      );
    }
  }
  if (p.permisos.length > 0) {
    pRows.push(subHeader("Permisos"));
    for (const perm of p.permisos)
      pRows.push(valRow("Personal / Motivo", perm.personalYMotivo));
  }
  if (p.devolucionHoras.lista.length > 0) {
    pRows.push(subHeader("Devolución de horas"));
    for (const d of p.devolucionHoras.lista)
      pRows.push(
        valRow(d.personal, `${d.desdeHora} → ${d.hastaHora}`)
      );
  }
  if (p.personalNuevo.lista.length > 0) {
    pRows.push(
      subHeader(
        `Personal nuevo (&lt;30 días): ${p.personalNuevo.cantidad ?? ""}`
      )
    );
    for (const n of p.personalNuevo.lista)
      pRows.push(valRow("Personal / Puesto", n.personalYPuesto));
  }
  pRows.push(txtRow("Vacaciones", p.vacaciones));
  if (p.capacitacion.length > 0) {
    pRows.push(subHeader("Capacitación"));
    for (const c of p.capacitacion)
      pRows.push(
        valRow("Personal / Capacitación", c.personalYCapacitacion)
      );
  }
  pRows.push(txtRow("Otros comentarios", p.otrosComentarios));
  if (pRows.some((r) => r !== "")) {
    sections.push(section("Personal", pRows, "#dc2626"));
  }

  // ── Sección MOLINO 3 + STOCK ──
  const m3 = report.molino3;
  const sb = report.stockBarro;
  const m3Has =
    hd(m3.horasMarcha) ||
    hd(m3.rendimientoHora) ||
    hd(m3.mantenimiento) ||
    hd(m3.aguaEnUso) ||
    hd(m3.cuerposMoliendaKG);
  const sbHas = hd(sb.arena) || hd(sb.recupero);

  if (m3Has || sbHas) {
    const mRows: string[] = [];
    if (m3Has) {
      mRows.push(subHeader("Molino 3"));
      mRows.push(bigRow("Horas de marcha", m3.horasMarcha, "HS"));
      mRows.push(bigRow("Rendimiento / hora", m3.rendimientoHora, "CM"));
      mRows.push(valRow("Cuerpos molienda", m3.cuerposMoliendaKG, "KG"));
      if (hd(m3.causaBajoRendimiento))
        mRows.push(txtRow("Causa bajo rendimiento", m3.causaBajoRendimiento));
      mRows.push(valRow("Agua en uso", m3.aguaEnUso));
      mRows.push(txtRow("Mantenimiento", m3.mantenimiento));
      mRows.push(txtRow("Limpieza", m3.limpieza));
    }
    if (sbHas) {
      mRows.push(subHeader("Stock de Barro"));
      mRows.push(bigRow("Arena", sb.arena, "MT"));
      mRows.push(bigRow("Recupero", sb.recupero, "MT"));
      mRows.push(txtRow("Comentarios", sb.comentarios));
      mRows.push(txtRow("Demoras", sb.demoras));
    }
    sections.push(section("Molino", mRows));
  }

  // ── SALA DE COLADO ──
  const sc = report.salaControl;
  const scHas = hasAnyField(sc as unknown as Record<string, unknown>);
  if (scHas) {
    const scRows: string[] = [];
    scRows.push(valRow("Hora de inicio", sc.horaInicio));
    if (hd(sc.moldesColados)) {
      scRows.push(bigRow("Moldes colados", sc.moldesColados, "UN"));
      const moldes = sc.moldesColados as number;
      if (moldes < OBJETIVO_MOLDES_COLADOS) {
        scRows.push(
          valRow(
            "Desvío vs objetivo",
            `${moldes - OBJETIVO_MOLDES_COLADOS} moldes (obj: ${OBJETIVO_MOLDES_COLADOS})`
          )
        );
      }
    }
    scRows.push(ordenListRow("Dintel colado", sc.dintelColado));
    scRows.push(ordenListRow("Cambio de cemento", sc.cambioCemento));
    scRows.push(ordenListRow("Cambio de cal", sc.cambioCal));
    scRows.push(txtRow("Pruebas / Ensayos", sc.pruebasEnsayos));
    scRows.push(txtRow("Demoras", sc.demoras));
    scRows.push(txtRow("Mantenimiento", sc.mantenimiento));
    scRows.push(txtRow("Limpieza", sc.limpieza));
    scRows.push(txtRow("Otros", sc.otros));
    sections.push(section("Sala de Colado", scRows));
  }

  // ── MADURACIÓN ──
  const mad = report.maduracion;
  const madHas = hasAnyField(mad as unknown as Record<string, unknown>);
  if (madHas) {
    const madRows: string[] = [];
    madRows.push(bigRow("Moldes en sala a fin de turno", mad.moldesEnSala, "UN"));
    madRows.push(valRow("Caloventores — Modo", mad.caloventoresModo));
    madRows.push(valRow("Caloventores — Temperatura", mad.caloventoresTemp, "°"));
    madRows.push(ordenListRow("Cambio de nylon", mad.cambioNylon));
    madRows.push(ordenListRow("Molde pinchado", mad.moldePinchado));
    madRows.push(ordenListRow("Molde fisurado", mad.moldeFisurado));
    madRows.push(txtRow("Demoras", mad.demoras));
    madRows.push(txtRow("Mantenimiento", mad.mantenimiento));
    madRows.push(txtRow("Limpieza", mad.limpieza));
    madRows.push(txtRow("Comentarios", mad.comentarios));
    sections.push(section("Maduración", madRows));
  }

  // ── CORTE / DESMANTELADO ──
  const corte = report.corteDesmantelado;
  const corteHas = hasAnyField(corte as unknown as Record<string, unknown>);
  if (corteHas) {
    const cRows: string[] = [];
    cRows.push(ordenListRow("Dintel cortado", corte.dintelCortado));
    cRows.push(ordenListRow("Molde fisurado", corte.moldeFisurado));
    cRows.push(txtRow("Demoras", corte.demoras));
    cRows.push(txtRow("Mantenimiento", corte.mantenimiento));
    cRows.push(txtRow("Limpieza", corte.limpieza));
    cRows.push(txtRow("Comentarios", corte.comentarios));
    sections.push(section("Corte / Desmantelado", cRows));
  }

  // ── ROTADOR ──
  const rot = report.rotador;
  if (rot.arrastreNylon.length > 0 || rot.moldeFisurado.length > 0) {
    const rRows: string[] = [];
    rRows.push(ordenListRow("Arrastre de nylon", rot.arrastreNylon));
    rRows.push(ordenListRow("Molde fisurado", rot.moldeFisurado));
    sections.push(section("Rotador", rRows));
  }

  // ── PRECURADO / AUTOCLAVES ──
  const pre = report.precuradoAutoclaves;
  const preHas = hasAnyField(pre as unknown as Record<string, unknown>);
  if (preHas) {
    const preRows: string[] = [];
    preRows.push(bigRow("Moldes en sala de pre-curado", pre.moldesPreCurado));
    preRows.push(bigRow("Moldes en ATC 2", pre.moldesATC2));
    if (hd(pre.moldesEnVias))
      preRows.push(valRow("Moldes en vías", pre.moldesEnVias, "UN"));
    preRows.push(txtRow("Demoras", pre.demoras));
    preRows.push(txtRow("Mantenimiento", pre.mantenimiento));
    preRows.push(txtRow("Limpieza", pre.limpieza));
    preRows.push(txtRow("Comentarios", pre.comentarios));
    sections.push(section("Precurado / Autoclaves", preRows));
  }

  // ── CALDERA ──
  const cal = report.caldera;
  if (hasAnyField(cal as unknown as Record<string, unknown>)) {
    const calRows: string[] = [];
    calRows.push(txtRow("Demoras", cal.demoras));
    calRows.push(txtRow("Mantenimiento", cal.mantenimiento));
    calRows.push(txtRow("Limpieza", cal.limpieza));
    calRows.push(txtRow("Comentarios", cal.comentarios));
    sections.push(section("Caldera", calRows));
  }

  // ── DESMOLDE ──
  const des = report.desmolde;
  const desHas = hasAnyField(des as unknown as Record<string, unknown>);
  if (desHas) {
    const desRows: string[] = [];
    desRows.push(bigRow("Moldes desmoldado en máquina", des.moldesMaquina));
    desRows.push(bigRow("Moldes desmoldado manual", des.moldesManual));
    desRows.push(ordenListRow("Dintel desmoldado", des.dintelDesmoldado));
    desRows.push(ordenListRow("Falla en aspiración", des.fallaAspiracion));
    desRows.push(ordenListRow("Fuera de medida", des.fueraMedida));
    if (des.ajustadas1era.activo) {
      const a = des.ajustadas1era;
      desRows.push(
        valRow(
          "Ajustadas 1era",
          `${a.signo} ${a.cantidad ?? ""} ${a.medida}`.trim()
        )
      );
    }
    if (des.ajustadasReproceso.activo) {
      const a = des.ajustadasReproceso;
      desRows.push(
        valRow(
          "Ajustadas reproceso",
          `${a.signo} ${a.cantidad ?? ""} ${a.medida}`.trim()
        )
      );
    }
    desRows.push(txtRow("Demoras", des.demoras));
    desRows.push(txtRow("Mantenimiento", des.mantenimiento));
    desRows.push(txtRow("Limpieza", des.limpieza));
    desRows.push(txtRow("Comentarios", des.comentarios));
    sections.push(section("Desmolde", desRows));
  }

  // ── GRANALLADO ──
  const gran = report.granallado;
  if (hasAnyField(gran as unknown as Record<string, unknown>)) {
    const granRows: string[] = [];
    granRows.push(bigRow("Planchas granalladas", gran.planchasGranalladas));
    granRows.push(txtRow("Demoras", gran.demoras));
    granRows.push(txtRow("Mantenimiento", gran.mantenimiento));
    granRows.push(txtRow("Limpieza", gran.limpieza));
    granRows.push(txtRow("Comentarios", gran.comentarios));
    sections.push(section("Granallado", granRows));
  }

  // ── SCRAP ──
  const scrap = report.scrap;
  if (hd(scrap.cerradoPct) || hd(scrap.parcialPct) || hd(scrap.moldesPendientes)) {
    const sRows: string[] = [];
    if (hd(scrap.cerradoPct))
      sRows.push(
        bigRow(
          "Scrap cerrado (desmolde completo)",
          fmtPct(scrap.cerradoPct)
        )
      );
    if (hd(scrap.parcialPct))
      sRows.push(
        bigRow(
          "Scrap parcial (desmolde incompleto)",
          fmtPct(scrap.parcialPct)
        )
      );
    sRows.push(
      bigRow("Moldes pendientes a desmoldar", scrap.moldesPendientes, "moldes")
    );
    sections.push(section("Scrap", sRows, "#dc2626"));
  }

  // ── TRANSFORMACIÓN ──
  const tr = report.transformacion;
  const trHasAny = (
    t: Record<string, unknown>
  ): boolean =>
    Object.values(t).some(
      (v) => hd(v) && v !== 0
    );
  const trGeneral =
    hd(tr.demoras) ||
    hd(tr.mantenimiento) ||
    hd(tr.limpieza) ||
    hd(tr.comentarios);

  if (
    trHasAny(tr.x15 as unknown as Record<string, unknown>) ||
    trHasAny(tr.x175 as unknown as Record<string, unknown>) ||
    trHasAny(tr.x20 as unknown as Record<string, unknown>) ||
    trHasAny(tr.x25 as unknown as Record<string, unknown>) ||
    trGeneral
  ) {
    const tRows: string[] = [];
    const renderSize = (
      label: string,
      t: Record<string, unknown>
    ) => {
      if (!trHasAny(t)) return;
      tRows.push(subHeader(`× ${label}`));
      tRows.push(valRow('Pallets "U" NA', t.palletsUNA, "PLL"));
      tRows.push(valRow('Pallets "U" EX', t.palletsUEX, "PLL"));
      tRows.push(valRow('Pallets "O"', t.palletsO, "PLL"));
      tRows.push(valRow('Cortados "45"', t.cortados45, "UN"));
      tRows.push(valRow('Para "VE"', t.ve, "UN"));
      tRows.push(valRow('Para "Descarte"', t.descarte, "UN"));
      tRows.push(valRow("O Exportación", t.palletsOExport, "PLL"));
    };
    renderSize("15", tr.x15 as unknown as Record<string, unknown>);
    renderSize("17,5", tr.x175 as unknown as Record<string, unknown>);
    renderSize("20", tr.x20 as unknown as Record<string, unknown>);
    renderSize("25", tr.x25 as unknown as Record<string, unknown>);
    tRows.push(txtRow("Demoras", tr.demoras));
    tRows.push(txtRow("Mantenimiento", tr.mantenimiento));
    tRows.push(txtRow("Limpieza", tr.limpieza));
    tRows.push(txtRow("Comentarios", tr.comentarios));
    sections.push(section("Transformación / Reproceso", tRows));
  }

  // ── AUTOELEVADORES ──
  if (report.autoelevadores.lista.length > 0) {
    const autoRows: string[] = [];
    autoRows.push(subHeader("Operadores"));
    for (const item of report.autoelevadores.lista) {
      if (hd(item.operador)) {
        autoRows.push(
          valRow(item.operador, `${item.desdeHora} → ${item.hastaHora}`)
        );
      }
    }
    sections.push(section("Autoelevadores", autoRows));
  }

  // ── RESUMEN MANTENIMIENTO ──
  let resumenHTML = "";
  const rm = report.resumenMantenimiento;
  if (rm && rm.length > 0) {
    let rmRows = "";
    for (const item of rm) {
      rmRows += `<tr>
        <td style="padding:8px 12px;font-size:13px;color:#1e293b;font-weight:600;border-bottom:1px solid #e2e8f0;vertical-align:top;width:200px;">${esc(item.area)}</td>
        <td style="padding:8px 12px;font-size:13px;color:#334155;border-bottom:1px solid #e2e8f0;line-height:1.6;">${nl2br(item.texto)}</td>
      </tr>`;
    }
    resumenHTML = `
    <tr><td colspan="2" style="padding:28px 0 0 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #1e293b;border-radius:8px;overflow:hidden;">
        <tr><td colspan="2" style="background:#1e293b;padding:10px 12px;font-size:14px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.5px;">
          Resumen de Mantenimiento
        </td></tr>
        ${rmRows}
      </table>
    </td></tr>`;
  }

  // ══════════════════════════════════════════
  // ENSAMBLAR EMAIL COMPLETO
  // ══════════════════════════════════════════

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;">
<tr><td align="center" style="padding:24px 16px;">

  <!-- MAIN CONTAINER -->
  <table width="640" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">

    <!-- HEADER -->
    <tr><td style="background:#ea580c;padding:20px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="vertical-align:middle;">
          <div style="font-size:24px;font-weight:800;color:#ffffff;letter-spacing:-0.3px;">FIN DE TURNO</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.8);margin-top:2px;">Reporte de producción — Ardal / Retak</div>
        </td>
        <td style="text-align:right;vertical-align:middle;">
          <div style="font-size:13px;color:rgba(255,255,255,0.9);">${report.encabezado.fecha}</div>
          <div style="display:inline-block;background:rgba(255,255,255,0.2);border-radius:4px;padding:2px 10px;font-size:12px;font-weight:700;color:#ffffff;margin-top:3px;">${turnoShort}</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.85);margin-top:3px;">${esc(report.encabezado.supervisor)}</div>
        </td>
      </tr></table>
    </td></tr>

    <!-- BODY -->
    <tr><td style="padding:0 24px 24px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${sections.join("")}
        ${resumenHTML}
      </table>
    </td></tr>

    <!-- FOOTER -->
    <tr><td style="background-color:#f8fafc;padding:14px 24px;text-align:center;border-top:1px solid #e2e8f0;">
      <div style="font-size:11px;color:#94a3b8;">Reporte generado automáticamente — Ardal S.A. / Retak</div>
    </td></tr>

  </table>

</td></tr>
</table>
</body>
</html>`;
}

// ══════════════════════════════════════════
// BUILDING BLOCKS
// ══════════════════════════════════════════

function section(
  title: string,
  rows: string[],
  color: string = "#ea580c"
): string {
  const filtered = rows.filter((r) => r !== "");
  if (filtered.length === 0) return "";

  return `
  <tr><td colspan="2" style="padding:20px 0 0 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
      <tr><td colspan="2" style="background:${color};padding:8px 12px;font-size:13px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.5px;">
        ${title}
      </td></tr>
      ${filtered.join("")}
    </table>
  </td></tr>`;
}

function subHeader(text: string): string {
  return `<tr><td colspan="2" style="padding:7px 12px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;background:#f8fafc;border-bottom:1px solid #e2e8f0;">${text}</td></tr>`;
}

function valRow(
  label: string,
  value: unknown,
  unit?: string
): string {
  if (!hd(value)) return "";
  const display =
    typeof value === "boolean" ? "Sí"
    : typeof value === "number" ? fmtNum(value)
    : esc(String(value));
  const unitStr = unit
    ? `<span style="color:#94a3b8;font-size:11px;margin-left:3px;">${unit}</span>`
    : "";
  return `<tr>
    <td style="padding:6px 12px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;width:45%;vertical-align:top;">${esc(label)}</td>
    <td style="padding:6px 12px;font-size:13px;color:#0f172a;border-bottom:1px solid #f1f5f9;font-weight:500;">${display}${unitStr}</td>
  </tr>`;
}

function bigRow(
  label: string,
  value: unknown,
  unit?: string
): string {
  if (!hd(value)) return "";
  const display =
    typeof value === "number" ? fmtNum(value) : esc(String(value));
  const unitStr = unit
    ? `<span style="color:#94a3b8;font-size:12px;margin-left:3px;">${unit}</span>`
    : "";
  return `<tr>
    <td style="padding:8px 12px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;width:45%;vertical-align:middle;">${esc(label)}</td>
    <td style="padding:8px 12px;font-size:20px;color:#0f172a;border-bottom:1px solid #f1f5f9;font-weight:800;">${display}${unitStr}</td>
  </tr>`;
}

function txtRow(label: string, value: unknown): string {
  if (!hd(value)) return "";
  return `<tr>
    <td style="padding:6px 12px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;width:45%;vertical-align:top;">${esc(label)}</td>
    <td style="padding:6px 12px;font-size:13px;color:#0f172a;border-bottom:1px solid #f1f5f9;line-height:1.6;">${nl2br(value)}</td>
  </tr>`;
}

function ordenListRow(label: string, items: OrdenItem[]): string {
  const values = items
    .map((it) => it.valor)
    .filter((v): v is number => v !== null && v !== undefined);
  if (values.length === 0) return "";
  const formatted = values.map((v) => `#${v}`).join(", ");
  return valRow(label, formatted);
}

// ══════════════════════════════════════════
// UTILITIES
// ══════════════════════════════════════════

function hd(val: unknown): boolean {
  if (val === null || val === undefined) return false;
  if (typeof val === "string") return val.trim() !== "";
  if (typeof val === "number") return true;
  if (typeof val === "boolean") return val === true;
  return false;
}

function hasAnyField(obj: Record<string, unknown>): boolean {
  return Object.values(obj).some((v) =>
    Array.isArray(v) ? v.length > 0 : hd(v)
  );
}

function fmtNum(n: number | null | undefined): string {
  if (n === null || n === undefined) return "";
  return n.toLocaleString("es-AR", { maximumFractionDigits: 2 });
}

function fmtPct(n: number | null | undefined): string {
  if (n === null || n === undefined) return "";
  return `${fmtNum(n)}%`;
}

function esc(str: string | null | undefined): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function nl2br(value: unknown): string {
  const str = String(value ?? "");
  return str
    .split(/\r?\n/)
    .map((l) => esc(l.trim()))
    .filter(Boolean)
    .join("<br>");
}

export function generateEmailSubject(report: Report): string {
  const turnoShort = report.encabezado.turno.replace("TURNO ", "");
  return `FDT ${report.encabezado.fecha} — ${turnoShort} — ${report.encabezado.supervisor}`;
}
