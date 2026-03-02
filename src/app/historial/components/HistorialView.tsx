"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, ClockCounterClockwise, X, Warning,
  CheckCircle, Envelope,
} from "@phosphor-icons/react";
import { TURNOS, SUPERVISORES, OBJETIVO_MOLDES_COLADOS, OBJETIVO_RENDIMIENTO_HORA } from "@/lib/constants";
import { generateEmailHTML } from "@/lib/email-generator";
import { compilarResumenMantenimiento } from "@/lib/schema";
import type { Report } from "@/lib/schema";
import { ProductionCharts } from "./ProductionCharts";

export type ReportRow = {
  id: string;
  createdAt: Date;
  fecha: string;
  turno: string;
  supervisor: string;
  userEmail: string;
  emailSent: boolean;
  molino3HorasMarcha: number;
  molino3RendimientoHora: number;
  molino3CuerposMoliendaKG: number;
  stockBarroArena: number;
  stockBarroRecupero: number;
  salaControlMoldesColados: number;
  maduracionMoldesEnSala: number;
  maduracionCaloventoresTemp: number;
  precuradoMoldesPreCurado: number;
  precuradoMoldesATC2: number;
  desmoldeMoldesMaquina: number;
  desmoldeMoldesManual: number;
  scrapParcialPct: number;
  transformacionTotalPallets: number | null;
  cantidadAusentes: number | null;
  tieneIncidentes: boolean;
  tieneAccidentes: boolean;
};

type Filters = {
  turno?: string;
  supervisor?: string;
  desde?: string;
  hasta?: string;
};

type Props = {
  reports: ReportRow[];
  total: number;
  page: number;
  limit: number;
  filters: Filters;
};

function n(val: number | null | undefined, decimals = 0): string {
  if (val === null || val === undefined) return "—";
  return decimals > 0 ? val.toFixed(decimals) : String(val);
}

function buildQuery(filters: Filters, page: number): string {
  const p = new URLSearchParams();
  if (filters.turno) p.set("turno", filters.turno);
  if (filters.supervisor) p.set("supervisor", filters.supervisor);
  if (filters.desde) p.set("desde", filters.desde);
  if (filters.hasta) p.set("hasta", filters.hasta);
  if (page > 1) p.set("page", String(page));
  const s = p.toString();
  return s ? `?${s}` : "";
}

export function HistorialView({ reports, total, page, limit, filters }: Props) {
  const [drawerReport, setDrawerReport] = useState<ReportRow | null>(null);
  const [drawerHTML, setDrawerHTML] = useState<string | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [showCharts, setShowCharts] = useState(false);

  const totalPages = Math.ceil(total / limit);

  const openDetail = async (row: ReportRow) => {
    setDrawerReport(row);
    setDrawerLoading(true);
    setDrawerHTML(null);
    try {
      const res = await fetch(`/api/reports/${row.id}`);
      if (res.ok) {
        const full = await res.json();
        const data = full.data as Report;
        data.resumenMantenimiento = compilarResumenMantenimiento(data);
        setDrawerHTML(generateEmailHTML(data));
      }
    } catch {
      // silently fail — user can close drawer
    } finally {
      setDrawerLoading(false);
    }
  };

  const closeDrawer = () => {
    setDrawerReport(null);
    setDrawerHTML(null);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-zinc-50">
      {/* Header */}
      <header className="bg-zinc-950 border-b border-zinc-800 px-4 md:px-6 py-3 sticky top-0 z-20">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#ea580c] shrink-0" />
            <span className="text-white font-bold text-sm tracking-tight">FDT</span>
            <span className="text-zinc-500 text-xs hidden sm:inline">Historial</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowCharts((v) => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-white rounded border border-zinc-800 hover:border-zinc-600"
              style={{ transition: "all 0.15s var(--ease-spring)" }}
            >
              {showCharts ? "Ocultar gráficos" : "Ver gráficos"}
            </button>
            <Link
              href="/fdt"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-white rounded border border-zinc-800 hover:border-zinc-600"
              style={{ transition: "all 0.15s var(--ease-spring)" }}
            >
              <ClockCounterClockwise size={12} />
              <span className="hidden sm:inline">Nuevo reporte</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-[1600px] mx-auto w-full px-4 md:px-6 py-6 space-y-5">

        {/* Filters */}
        <form action="/historial" method="GET" className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.08em] mb-1">
              Desde
            </label>
            <input
              type="date"
              name="desde"
              defaultValue={filters.desde || ""}
              className="text-xs px-2.5 py-1.5 border border-zinc-200 rounded bg-white text-zinc-800 focus:outline-none focus:border-[#ea580c]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.08em] mb-1">
              Hasta
            </label>
            <input
              type="date"
              name="hasta"
              defaultValue={filters.hasta || ""}
              className="text-xs px-2.5 py-1.5 border border-zinc-200 rounded bg-white text-zinc-800 focus:outline-none focus:border-[#ea580c]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.08em] mb-1">
              Turno
            </label>
            <select
              name="turno"
              defaultValue={filters.turno || ""}
              className="text-xs px-2.5 py-1.5 border border-zinc-200 rounded bg-white text-zinc-800 focus:outline-none focus:border-[#ea580c]"
            >
              <option value="">Todos</option>
              {TURNOS.map((t) => (
                <option key={t} value={t}>{t.replace("TURNO ", "")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.08em] mb-1">
              Supervisor
            </label>
            <select
              name="supervisor"
              defaultValue={filters.supervisor || ""}
              className="text-xs px-2.5 py-1.5 border border-zinc-200 rounded bg-white text-zinc-800 focus:outline-none focus:border-[#ea580c]"
            >
              <option value="">Todos</option>
              {SUPERVISORES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#ea580c] text-white text-xs font-medium rounded hover:bg-[#c2410c]"
            style={{ transition: "background 0.15s var(--ease-spring)" }}
          >
            Filtrar
          </button>
          {(filters.turno || filters.supervisor || filters.desde || filters.hasta) && (
            <Link
              href="/historial"
              className="px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-800 rounded border border-zinc-200 hover:border-zinc-400"
              style={{ transition: "all 0.15s var(--ease-spring)" }}
            >
              Limpiar
            </Link>
          )}
          <span className="text-xs text-zinc-400 ml-auto">
            {total} reporte{total !== 1 ? "s" : ""}
          </span>
        </form>

        {/* Charts (collapsible) */}
        {showCharts && reports.length > 0 && (
          <ProductionCharts reports={reports} />
        )}

        {/* Table */}
        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-zinc-400">
            <ClockCounterClockwise size={32} className="mb-3 opacity-30" />
            <p className="text-sm">No hay reportes guardados aún</p>
            <p className="text-xs mt-1 text-zinc-500">
              Los reportes se guardan al generar la vista previa del email
            </p>
          </div>
        ) : (
          <div className="border border-zinc-200 rounded-md overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="text-xs w-full border-collapse">
                <thead>
                  {/* Section group header row */}
                  <tr className="border-b border-zinc-200">
                    <th colSpan={3} className="text-left px-3 py-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.1em] bg-zinc-100 border-r border-zinc-200 whitespace-nowrap">
                      Encabezado
                    </th>
                    <th className="text-center px-3 py-1 text-[10px] font-semibold text-blue-600 uppercase tracking-[0.1em] bg-blue-100 whitespace-nowrap border-l border-blue-200">
                      Sala de Colado
                    </th>
                    <th colSpan={3} className="text-center px-3 py-1 text-[10px] font-semibold text-orange-600 uppercase tracking-[0.1em] bg-orange-100 whitespace-nowrap border-l border-orange-200">
                      Molino 3
                    </th>
                    <th colSpan={2} className="text-center px-3 py-1 text-[10px] font-semibold text-emerald-700 uppercase tracking-[0.1em] bg-emerald-100 whitespace-nowrap border-l border-emerald-200">
                      Stock Barro
                    </th>
                    <th colSpan={2} className="text-center px-3 py-1 text-[10px] font-semibold text-yellow-700 uppercase tracking-[0.1em] bg-yellow-100 whitespace-nowrap border-l border-yellow-200">
                      Maduración
                    </th>
                    <th colSpan={2} className="text-center px-3 py-1 text-[10px] font-semibold text-purple-700 uppercase tracking-[0.1em] bg-purple-100 whitespace-nowrap border-l border-purple-200">
                      Precurado
                    </th>
                    <th colSpan={2} className="text-center px-3 py-1 text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.1em] bg-zinc-200 whitespace-nowrap border-l border-zinc-300">
                      Desmolde
                    </th>
                    <th className="text-center px-3 py-1 text-[10px] font-semibold text-red-600 uppercase tracking-[0.1em] bg-red-100 whitespace-nowrap border-l border-red-200">
                      Scrap
                    </th>
                    <th className="text-center px-3 py-1 text-[10px] font-semibold text-indigo-600 uppercase tracking-[0.1em] bg-indigo-100 whitespace-nowrap border-l border-indigo-200">
                      Transform.
                    </th>
                    <th colSpan={2} className="text-center px-3 py-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.1em] bg-zinc-100 whitespace-nowrap border-l border-zinc-200">
                      Personal
                    </th>
                  </tr>
                  {/* Column headers */}
                  <tr className="bg-zinc-50 border-b border-zinc-200">
                    <th className="sticky left-0 z-10 bg-zinc-50 text-left px-3 py-2 font-semibold text-zinc-500 uppercase tracking-[0.08em] whitespace-nowrap border-r border-zinc-200 min-w-[90px]">Fecha</th>
                    <th className="sticky left-[90px] z-10 bg-zinc-50 text-left px-3 py-2 font-semibold text-zinc-500 uppercase tracking-[0.08em] whitespace-nowrap border-r border-zinc-200 min-w-[72px]">Turno</th>
                    <th className="text-left px-3 py-2 font-semibold text-zinc-500 uppercase tracking-[0.08em] whitespace-nowrap border-r border-zinc-100 min-w-[120px]">Supervisor</th>
                    {/* Sala de Colado */}
                    <th className="text-right px-3 py-2 font-semibold text-zinc-500 uppercase tracking-[0.08em] whitespace-nowrap border-l border-blue-200 bg-blue-50" title="Moldes colados (objetivo: 19)">Colados</th>
                    {/* Molino */}
                    <th className="text-right px-3 py-2 font-semibold text-zinc-500 uppercase tracking-[0.08em] whitespace-nowrap border-l border-orange-200 bg-orange-50" title="Rendimiento horario molino (objetivo: 50 CM/h)">Rend/h</th>
                    <th className="text-right px-3 py-2 font-semibold text-zinc-500 uppercase tracking-[0.08em] whitespace-nowrap bg-orange-50" title="Horas de marcha molino">Hs marcha</th>
                    <th className="text-right px-3 py-2 font-semibold text-zinc-500 uppercase tracking-[0.08em] whitespace-nowrap bg-orange-50" title="Cuerpos de molienda KG">Cuerpos kg</th>
                    {/* Stock */}
                    <th className="text-right px-3 py-2 font-semibold text-zinc-500 uppercase tracking-[0.08em] whitespace-nowrap border-l border-emerald-200 bg-emerald-50" title="Stock arena MT">Arena MT</th>
                    <th className="text-right px-3 py-2 font-semibold text-zinc-500 uppercase tracking-[0.08em] whitespace-nowrap bg-emerald-50" title="Stock recupero MT">Recup. MT</th>
                    {/* Maduración */}
                    <th className="text-right px-3 py-2 font-semibold text-zinc-500 uppercase tracking-[0.08em] whitespace-nowrap border-l border-yellow-200 bg-yellow-50" title="Moldes en sala de maduración">En sala</th>
                    <th className="text-right px-3 py-2 font-semibold text-zinc-500 uppercase tracking-[0.08em] whitespace-nowrap bg-yellow-50" title="Temperatura caloventores °C">Temp °C</th>
                    {/* Precurado */}
                    <th className="text-right px-3 py-2 font-semibold text-zinc-500 uppercase tracking-[0.08em] whitespace-nowrap border-l border-purple-200 bg-purple-50" title="Moldes en precurado">Precurado</th>
                    <th className="text-right px-3 py-2 font-semibold text-zinc-500 uppercase tracking-[0.08em] whitespace-nowrap bg-purple-50" title="Moldes en ATC2">ATC2</th>
                    {/* Desmolde */}
                    <th className="text-right px-3 py-2 font-semibold text-zinc-500 uppercase tracking-[0.08em] whitespace-nowrap border-l border-zinc-300 bg-zinc-100" title="Desmolde máquina">Desmolde máq</th>
                    <th className="text-right px-3 py-2 font-semibold text-zinc-500 uppercase tracking-[0.08em] whitespace-nowrap bg-zinc-100" title="Desmolde manual">Desmolde man</th>
                    {/* Scrap */}
                    <th className="text-right px-3 py-2 font-semibold text-zinc-500 uppercase tracking-[0.08em] whitespace-nowrap border-l border-red-200 bg-red-50" title="Scrap parcial %">Scrap %</th>
                    {/* Transformación */}
                    <th className="text-right px-3 py-2 font-semibold text-zinc-500 uppercase tracking-[0.08em] whitespace-nowrap border-l border-indigo-200 bg-indigo-50" title="Total pallets transformación">Pallets</th>
                    {/* Personal */}
                    <th className="text-right px-3 py-2 font-semibold text-zinc-500 uppercase tracking-[0.08em] whitespace-nowrap border-l border-zinc-200" title="Cantidad de ausentes">Ausentes</th>
                    <th className="text-center px-3 py-2 font-semibold text-zinc-500 uppercase tracking-[0.08em] whitespace-nowrap" title="Incidentes / Accidentes">Inc/Acc</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {reports.map((row) => {
                    const molajesBajo = row.salaControlMoldesColados < OBJETIVO_MOLDES_COLADOS;
                    const rendBajo = row.molino3RendimientoHora < OBJETIVO_RENDIMIENTO_HORA;
                    return (
                      <tr
                        key={row.id}
                        onClick={() => openDetail(row)}
                        className="hover:bg-zinc-50 cursor-pointer"
                        style={{ transition: "background 0.1s var(--ease-spring)" }}
                      >
                        <td className="sticky left-0 z-10 bg-white px-3 py-2 font-mono tabular-nums text-zinc-700 border-r border-zinc-100 whitespace-nowrap">
                          {row.fecha}
                        </td>
                        <td className="sticky left-[90px] z-10 bg-white px-3 py-2 border-r border-zinc-100 whitespace-nowrap">
                          <span className="font-medium text-zinc-700">
                            {row.turno.replace("TURNO ", "")}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-zinc-600 border-r border-zinc-100 whitespace-nowrap max-w-[160px] truncate">
                          {row.supervisor.split(" - ").slice(1).join(" - ") || row.supervisor}
                        </td>
                        {/* Colados */}
                        <td className={`px-3 py-2 text-right tabular-nums font-mono ${molajesBajo ? "text-[#ea580c] font-semibold" : "text-zinc-700"}`}>
                          {n(row.salaControlMoldesColados)}
                        </td>
                        {/* Molino */}
                        <td className={`px-3 py-2 text-right tabular-nums font-mono ${rendBajo ? "text-[#ea580c] font-semibold" : "text-zinc-700"}`}>
                          {n(row.molino3RendimientoHora, 1)}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums font-mono text-zinc-700">
                          {n(row.molino3HorasMarcha, 1)}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums font-mono text-zinc-700">
                          {n(row.molino3CuerposMoliendaKG)}
                        </td>
                        {/* Stock */}
                        <td className="px-3 py-2 text-right tabular-nums font-mono text-zinc-700">
                          {n(row.stockBarroArena, 1)}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums font-mono text-zinc-700">
                          {n(row.stockBarroRecupero, 1)}
                        </td>
                        {/* Maduración */}
                        <td className="px-3 py-2 text-right tabular-nums font-mono text-zinc-700">
                          {n(row.maduracionMoldesEnSala)}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums font-mono text-zinc-700">
                          {n(row.maduracionCaloventoresTemp, 1)}
                        </td>
                        {/* Precurado */}
                        <td className="px-3 py-2 text-right tabular-nums font-mono text-zinc-700">
                          {n(row.precuradoMoldesPreCurado)}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums font-mono text-zinc-700">
                          {n(row.precuradoMoldesATC2)}
                        </td>
                        {/* Desmolde */}
                        <td className="px-3 py-2 text-right tabular-nums font-mono text-zinc-700">
                          {n(row.desmoldeMoldesMaquina)}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums font-mono text-zinc-700">
                          {n(row.desmoldeMoldesManual)}
                        </td>
                        {/* Scrap */}
                        <td className="px-3 py-2 text-right tabular-nums font-mono text-zinc-700">
                          {n(row.scrapParcialPct, 1)}
                        </td>
                        {/* Pallets */}
                        <td className="px-3 py-2 text-right tabular-nums font-mono text-zinc-700">
                          {n(row.transformacionTotalPallets)}
                        </td>
                        {/* Ausentes */}
                        <td className="px-3 py-2 text-right tabular-nums font-mono text-zinc-700">
                          {n(row.cantidadAusentes)}
                        </td>
                        {/* Inc/Acc */}
                        <td className="px-3 py-2 text-center">
                          {row.tieneAccidentes && (
                            <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1" title="Accidente" />
                          )}
                          {row.tieneIncidentes && (
                            <span className="inline-block w-2 h-2 rounded-full bg-yellow-400" title="Incidente" />
                          )}
                          {!row.tieneAccidentes && !row.tieneIncidentes && (
                            <span className="text-zinc-300">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">
              Página {page} de {totalPages}
            </span>
            <div className="flex items-center gap-2">
              {page > 1 && (
                <Link
                  href={`/historial${buildQuery(filters, page - 1)}`}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-800 rounded border border-zinc-200 hover:border-zinc-400"
                  style={{ transition: "all 0.15s var(--ease-spring)" }}
                >
                  <ArrowLeft size={12} />
                  Anterior
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/historial${buildQuery(filters, page + 1)}`}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-800 rounded border border-zinc-200 hover:border-zinc-400"
                  style={{ transition: "all 0.15s var(--ease-spring)" }}
                >
                  Siguiente
                  <ArrowRight size={12} />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      {drawerReport && (
        <div
          className="fixed inset-0 z-50 flex"
          onClick={closeDrawer}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-zinc-950/60" />

          {/* Panel */}
          <div
            className="relative ml-auto w-full max-w-2xl bg-white flex flex-col h-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div className="bg-zinc-950 border-b border-zinc-800 px-5 py-3 flex items-center justify-between shrink-0">
              <div>
                <p className="text-white font-semibold text-sm">
                  {drawerReport.fecha} — {drawerReport.turno.replace("TURNO ", "")}
                </p>
                <p className="text-zinc-500 text-xs mt-0.5">
                  {drawerReport.supervisor}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {drawerReport.emailSent ? (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <CheckCircle size={12} weight="fill" />
                    Email enviado
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <Envelope size={12} />
                    Sin email
                  </span>
                )}
                <button
                  onClick={closeDrawer}
                  className="p-1.5 text-zinc-500 hover:text-white rounded"
                  style={{ transition: "color 0.15s var(--ease-spring)" }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Drawer content */}
            <div className="flex-1 overflow-y-auto p-5">
              {drawerLoading ? (
                <div className="flex items-center justify-center h-40 text-zinc-400 text-sm">
                  Cargando…
                </div>
              ) : drawerHTML ? (
                <div
                  className="bg-white"
                  dangerouslySetInnerHTML={{ __html: drawerHTML }}
                />
              ) : (
                <div className="flex items-center justify-center h-40 text-zinc-400 text-sm gap-2">
                  <Warning size={16} />
                  No se pudo cargar el detalle
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
