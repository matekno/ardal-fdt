"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, BarChart, Bar, ResponsiveContainer, Legend,
} from "recharts";
import type { ReportRow } from "./HistorialView";

type Props = {
  reports: ReportRow[];
  objetivoMoldesColados: number;
  objetivoRendimientoHora: number;
};

const TURNO_COLOR: Record<string, string> = {
  "TURNO MAÑANA": "var(--color-ardal)",
  "TURNO TARDE": "#0284c7",
  "TURNO NOCHE": "#7c3aed",
};

function shortDate(fecha: string) {
  const [, m, d] = fecha.split("-");
  return `${d}/${m}`;
}

export function ProductionCharts({ reports, objetivoMoldesColados, objetivoRendimientoHora }: Props) {
  // Sort ascending by fecha for charts
  const sorted = [...reports].sort((a, b) => a.fecha.localeCompare(b.fecha));

  const chartData = sorted.map((r) => ({
    fecha: shortDate(r.fecha),
    fechaFull: r.fecha,
    turno: r.turno.replace("TURNO ", ""),
    moldesColados: r.salaControlMoldesColados,
    rendimiento: r.molino3RendimientoHora,
    pallets: r.transformacionTotalPallets ?? 0,
    ausentes: r.cantidadAusentes ?? 0,
    fill: TURNO_COLOR[r.turno] ?? "var(--color-ardal)",
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Moldes colados */}
      <div className="bg-white border border-zinc-200 rounded-md p-4">
        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.08em] mb-4">
          Moldes Colados por Turno
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
            <XAxis dataKey="fecha" tick={{ fontSize: 10, fill: "#71717a" }} />
            <YAxis tick={{ fontSize: 10, fill: "#71717a" }} />
            <Tooltip
              contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid #e4e4e7" }}
              labelStyle={{ fontWeight: 600, color: "#18181b" }}
            />
            <ReferenceLine y={objetivoMoldesColados} stroke="var(--color-ardal)" strokeDasharray="4 4" label={{ value: `Obj ${objetivoMoldesColados}`, fontSize: 10, fill: "var(--color-ardal)", position: "right" }} />
            <Bar dataKey="moldesColados" name="Colados" radius={[2, 2, 0, 0]}>
              {chartData.map((entry, i) => (
                <rect key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Rendimiento horario */}
      <div className="bg-white border border-zinc-200 rounded-md p-4">
        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.08em] mb-4">
          Rendimiento Horario Molino (CM/h)
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
            <XAxis dataKey="fecha" tick={{ fontSize: 10, fill: "#71717a" }} />
            <YAxis tick={{ fontSize: 10, fill: "#71717a" }} />
            <Tooltip
              contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid #e4e4e7" }}
              labelStyle={{ fontWeight: 600, color: "#18181b" }}
            />
            <ReferenceLine y={objetivoRendimientoHora} stroke="var(--color-ardal)" strokeDasharray="4 4" label={{ value: `Obj ${objetivoRendimientoHora}`, fontSize: 10, fill: "var(--color-ardal)", position: "right" }} />
            <Line
              type="monotone"
              dataKey="rendimiento"
              name="Rend/h"
              stroke="var(--color-ardal)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--color-ardal)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Total pallets */}
      <div className="bg-white border border-zinc-200 rounded-md p-4">
        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.08em] mb-4">
          Total Pallets Transformación
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
            <XAxis dataKey="fecha" tick={{ fontSize: 10, fill: "#71717a" }} />
            <YAxis tick={{ fontSize: 10, fill: "#71717a" }} />
            <Tooltip
              contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid #e4e4e7" }}
              labelStyle={{ fontWeight: 600, color: "#18181b" }}
            />
            <Line
              type="monotone"
              dataKey="pallets"
              name="Pallets"
              stroke="#0284c7"
              strokeWidth={2}
              dot={{ r: 3, fill: "#0284c7" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Ausentes */}
      <div className="bg-white border border-zinc-200 rounded-md p-4">
        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.08em] mb-4">
          Ausentes por Turno
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
            <XAxis dataKey="fecha" tick={{ fontSize: 10, fill: "#71717a" }} />
            <YAxis tick={{ fontSize: 10, fill: "#71717a" }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid #e4e4e7" }}
              labelStyle={{ fontWeight: 600, color: "#18181b" }}
            />
            <Bar dataKey="ausentes" name="Ausentes" fill="#7c3aed" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
