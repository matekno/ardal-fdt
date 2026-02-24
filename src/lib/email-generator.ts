/**
 * Generador de email HTML para reportes FDT
 * Port directo de poc-a/html-generator.js a TypeScript
 */

import type { Report } from "./schema";

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
  if (p.cambiosHorario.length > 0) {
    pRows.push(subHeader("Cambios de horario"));
    for (const c of p.cambiosHorario) {
      pRows.push(valRow("Ausente", c.ausente));
      pRows.push(valRow("Presente", c.presente));
      pRows.push(txtRow("Comentario", c.comentario));
    }
  }
  if (p.horasExtras.length > 0) {
    pRows.push(subHeader("Horas extras"));
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

  // ── Sección MOLINO ──
  const m3 = report.molino3,
    m2 = report.molino2,
    sb = report.stockBarro;
  const m3Has =
    hd(m3.horasMarcha) ||
    hd(m3.rendimientoHora) ||
    hd(m3.mantenimiento) ||
    hd(m3.aguaEnUso) ||
    hd(m3.cuerposMoliendaKG);
  const m2Has =
    hd(m2.horasMarcha) ||
    hd(m2.rendimientoHora) ||
    hd(m2.mantenimiento) ||
    hd(m2.aguaEnUso) ||
    hd(m2.cuerposMoliendaKG);
  const sbHas = hd(sb.arena) || hd(sb.recupero);

  if (m3Has || m2Has || sbHas) {
    const mRows: string[] = [];
    mRows.push(
      valRow("Sistema dosificación A/Y", m3.sistemaDosificacion)
    );
    if (m3Has) {
      mRows.push(subHeader("Molino 3"));
      mRows.push(bigRow("Horas de marcha", m3.horasMarcha, "HS"));
      mRows.push(bigRow("Rendimiento / hora", m3.rendimientoHora, "CM"));
      mRows.push(
        valRow(
          "Cuerpos molienda (baldes x 30kg)",
          m3.cuerposMoliendaUN,
          "UN"
        )
      );
      mRows.push(valRow("Cuerpos molienda", m3.cuerposMoliendaKG, "KG"));
      mRows.push(valRow("Agua en uso", m3.aguaEnUso));
      mRows.push(txtRow("Mantenimiento", m3.mantenimiento));
      mRows.push(txtRow("Limpieza", m3.limpieza));
    }
    if (m2Has) {
      mRows.push(subHeader("Molino 2"));
      mRows.push(bigRow("Horas de marcha", m2.horasMarcha, "HS"));
      mRows.push(bigRow("Rendimiento / hora", m2.rendimientoHora, "CM"));
      mRows.push(
        valRow(
          "Cuerpos molienda (baldes x 30kg)",
          m2.cuerposMoliendaUN,
          "UN"
        )
      );
      mRows.push(valRow("Cuerpos molienda", m2.cuerposMoliendaKG, "KG"));
      mRows.push(valRow("Agua en uso", m2.aguaEnUso));
      mRows.push(txtRow("Mantenimiento", m2.mantenimiento));
      mRows.push(txtRow("Limpieza", m2.limpieza));
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

  // ── Secciones de planta (pattern genérico) ──
  const plantSections: [
    string,
    Record<string, unknown>,
    [string, string, string, string?][]
  ][] = [
    [
      "Sala de Control",
      report.salaControl,
      [
        ["Hora de inicio", "horaInicio", "val", "HS"],
        ["Moldes colados", "moldesColados", "big", "UN"],
        ["Dintel colado orden", "dintelColado", "val"],
        ["Cambio de cemento orden", "cambioCemento", "val"],
        ["Cambio de cal orden", "cambioCal", "val"],
        ["Pruebas / Ensayos", "pruebasEnsayos", "txt"],
        ["Demoras", "demoras", "txt"],
        ["Mantenimiento", "mantenimiento", "txt"],
        ["Limpieza", "limpieza", "txt"],
        ["Otros", "otros", "txt"],
      ],
    ],
    [
      "Maduración",
      report.maduracion,
      [
        ["Moldes en sala a fin de turno", "moldesEnSala", "big", "UN"],
        ["Caloventores — Modo", "caloventoresModo", "val"],
        ["Caloventores — Temperatura", "caloventoresTemp", "val", "°"],
        ["Cambio de nylon orden", "cambioNylon", "val"],
        ["Molde pinchado orden", "moldePinchado", "val"],
        ["Molde fisurado orden", "moldeFisurado", "val"],
        ["Demoras", "demoras", "txt"],
        ["Mantenimiento", "mantenimiento", "txt"],
        ["Limpieza", "limpieza", "txt"],
        ["Comentarios", "comentarios", "txt"],
      ],
    ],
    [
      "Corte / Desmantelado",
      report.corteDesmantelado,
      [
        ["Dintel cortado orden", "dintelCortado", "val"],
        ["Molde fisurado orden", "moldeFisurado", "val"],
        ["Demoras", "demoras", "txt"],
        ["Mantenimiento", "mantenimiento", "txt"],
        ["Limpieza", "limpieza", "txt"],
        ["Comentarios", "comentarios", "txt"],
      ],
    ],
    [
      "Precurado / Autoclaves",
      report.precuradoAutoclaves,
      [
        ["Moldes en sala de pre-curado", "moldesPreCurado", "big"],
        ["Moldes en ATC 2", "moldesATC2", "big"],
        ["Demoras", "demoras", "txt"],
        ["Mantenimiento", "mantenimiento", "txt"],
        ["Limpieza", "limpieza", "txt"],
        ["Comentarios", "comentarios", "txt"],
      ],
    ],
    [
      "Caldera",
      report.caldera,
      [
        ["Demoras", "demoras", "txt"],
        ["Mantenimiento", "mantenimiento", "txt"],
        ["Limpieza", "limpieza", "txt"],
        ["Comentarios", "comentarios", "txt"],
      ],
    ],
    [
      "Desmolde",
      report.desmolde,
      [
        ["Moldes desmoldado en máquina", "moldesMaquina", "big"],
        ["Moldes desmoldado manual", "moldesManual", "big"],
        ["Dintel desmoldado orden", "dintelDesmoldado", "val"],
        ["Falla en aspiración orden", "fallaAspiracion", "val"],
        ["Fuera de medida orden", "fueraMedida", "val"],
        ["Unidades ajustadas de 1era", "ajustadas1era", "val"],
        ["Unidades ajustadas reproceso", "ajustadasReproceso", "val"],
        ["Demoras", "demoras", "txt"],
        ["Mantenimiento", "mantenimiento", "txt"],
        ["Limpieza", "limpieza", "txt"],
        ["Comentarios", "comentarios", "txt"],
      ],
    ],
    [
      "Granallado",
      report.granallado,
      [
        ["Planchas granalladas", "planchasGranalladas", "big"],
        ["Demoras", "demoras", "txt"],
        ["Mantenimiento", "mantenimiento", "txt"],
        ["Limpieza", "limpieza", "txt"],
        ["Comentarios", "comentarios", "txt"],
      ],
    ],
  ];

  for (const [title, data, fields] of plantSections) {
    if (!hasAnyField(data)) continue;
    const rows: string[] = [];
    for (const [label, key, type, unit] of fields) {
      const val = (data as Record<string, unknown>)[key];
      if (type === "big") rows.push(bigRow(label, val, unit));
      else if (type === "txt") rows.push(txtRow(label, val));
      else rows.push(valRow(label, val, unit));
    }
    sections.push(section(title, rows));
  }

  // ── Rotador ──
  const rot = report.rotador;
  if (hasAnyField(rot) || rot.columnasEncimado.length > 0) {
    const rRows: string[] = [];
    rRows.push(valRow("Arrastre de nylon orden", rot.arrastreNylon));
    rRows.push(valRow("Molde fisurado orden", rot.moldeFisurado));
    if (rot.columnasEncimado.length > 0) {
      rRows.push(subHeader("Columnas de encimado"));
      rot.columnasEncimado.forEach((c, i) => {
        rRows.push(valRow(`Col. ${i + 1} — Número`, c.numero));
        rRows.push(valRow(`Col. ${i + 1} — Defecto`, c.defecto));
      });
    }
    rRows.push(txtRow("Demoras", rot.demoras));
    rRows.push(txtRow("Mantenimiento", rot.mantenimiento));
    rRows.push(txtRow("Limpieza", rot.limpieza));
    rRows.push(txtRow("Comentarios", rot.comentarios));
    sections.push(section("Rotador", rRows));
  }

  // ── SCRAP ──
  const sc = report.scrap;
  if (hd(sc.cerradoPct) || hd(sc.parcialPct) || hd(sc.moldesPendientes)) {
    const sRows: string[] = [];
    if (hd(sc.cerradoPct))
      sRows.push(
        bigRow(
          "Scrap cerrado (desmolde completo)",
          fmtPct(sc.cerradoPct)
        )
      );
    if (hd(sc.parcialPct))
      sRows.push(
        bigRow(
          "Scrap parcial (desmolde incompleto)",
          fmtPct(sc.parcialPct)
        )
      );
    sRows.push(
      bigRow("Moldes pendientes a desmoldar", sc.moldesPendientes, "moldes")
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
    trHasAny(tr.x15) ||
    trHasAny(tr.x175) ||
    trHasAny(tr.x20) ||
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
      if (hd(t.descartePct))
        tRows.push(valRow("% Descarte", fmtPct(t.descartePct as number)));
    };
    renderSize("15", tr.x15);
    renderSize("17,5", tr.x175);
    renderSize("20", tr.x20);
    tRows.push(txtRow("Demoras", tr.demoras));
    tRows.push(txtRow("Mantenimiento", tr.mantenimiento));
    tRows.push(txtRow("Limpieza", tr.limpieza));
    tRows.push(txtRow("Comentarios", tr.comentarios));
    sections.push(section("Transformación / Reproceso", tRows));
  }

  // ── AUTOELEVADORES ──
  if (hd(report.autoelevadores.comentarios)) {
    sections.push(
      section("Autoelevadores", [
        txtRow("Comentarios", report.autoelevadores.comentarios),
      ])
    );
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
    typeof value === "number" ? fmtNum(value) : esc(String(value));
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

// ══════════════════════════════════════════
// UTILITIES
// ══════════════════════════════════════════

function hd(val: unknown): boolean {
  if (val === null || val === undefined) return false;
  if (typeof val === "string") return val.trim() !== "";
  if (typeof val === "number") return true;
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
