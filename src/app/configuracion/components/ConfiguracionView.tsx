"use client";

import { useState, useCallback } from "react";
import type { AppSettings } from "@/lib/settings";
import {
  ArrowLeft,
  Plus,
  X,
  CheckCircle,
  SpinnerGap,
  Warning,
  Gear,
  Users,
  Truck,
  Briefcase,
  ClipboardText,
  Envelope,
  ChartBar,
} from "@phosphor-icons/react";

type SaveStatus = "idle" | "saving" | "saved" | "error";

function useSaveSetting(key: string) {
  const [status, setStatus] = useState<SaveStatus>("idle");

  const save = useCallback(
    async (value: unknown) => {
      setStatus("saving");
      try {
        const res = await fetch(`/api/settings/${key}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value }),
        });
        setStatus(res.ok ? "saved" : "error");
        if (res.ok) setTimeout(() => setStatus("idle"), 2500);
      } catch {
        setStatus("error");
      }
    },
    [key]
  );

  return { status, save };
}

function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;
  return (
    <span
      className={`flex items-center gap-1 text-[11px] ${
        status === "saving"
          ? "text-zinc-500"
          : status === "saved"
            ? "text-emerald-400"
            : "text-red-400"
      }`}
    >
      {status === "saving" && (
        <SpinnerGap size={11} className="animate-spin" />
      )}
      {status === "saved" && <CheckCircle size={11} weight="fill" />}
      {status === "error" && <Warning size={11} weight="fill" />}
      {status === "saving"
        ? "Guardando…"
        : status === "saved"
          ? "Guardado"
          : "Error al guardar"}
    </span>
  );
}

// Editable list of strings
function StringListEditor({
  settingKey,
  initialValues,
}: {
  settingKey: string;
  initialValues: string[];
}) {
  const [items, setItems] = useState<string[]>(initialValues);
  const [newItem, setNewItem] = useState("");
  const { status, save } = useSaveSetting(settingKey);

  const removeItem = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));

  const addItem = () => {
    const trimmed = newItem.trim();
    if (!trimmed || items.includes(trimmed)) return;
    setItems((prev) => [...prev, trimmed]);
    setNewItem("");
  };

  return (
    <div className="space-y-2">
      {/* List */}
      <div className="divide-y divide-zinc-100">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 gap-2">
            <span className="text-xs text-zinc-700 font-mono">{item}</span>
            <button
              onClick={() => removeItem(i)}
              className="p-1 text-zinc-400 hover:text-red-400 rounded shrink-0"
              style={{ transition: "color 0.15s" }}
              title="Eliminar"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-zinc-400 py-2">Sin elementos.</p>
        )}
      </div>

      {/* Add new */}
      <div className="flex gap-2 pt-1">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          placeholder="Nuevo elemento..."
          className="flex-1 px-2 py-1.5 text-xs border border-zinc-200 rounded bg-white focus:border-ardal focus:ring-0 focus:outline-none font-mono"
        />
        <button
          onClick={addItem}
          disabled={!newItem.trim()}
          className="px-2.5 py-1.5 text-xs font-medium text-ardal border border-ardal/30 rounded hover:bg-ardal/5 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ transition: "all 0.15s" }}
        >
          <Plus size={12} />
        </button>
      </div>

      {/* Save */}
      <div className="flex items-center justify-between pt-2">
        <SaveIndicator status={status} />
        <button
          onClick={() => save(items)}
          disabled={status === "saving"}
          className="px-4 py-1.5 text-xs font-medium bg-ardal text-white rounded hover:bg-ardal-dark disabled:opacity-50"
          style={{ transition: "all 0.15s" }}
        >
          Guardar lista
        </button>
      </div>
    </div>
  );
}

// Number setting editor
function NumberEditor({
  settingKey,
  initialValue,
  unit,
}: {
  settingKey: string;
  initialValue: number;
  unit?: string;
}) {
  const [value, setValue] = useState(String(initialValue));
  const { status, save } = useSaveSetting(settingKey);

  return (
    <div className="flex items-center gap-3">
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onWheel={(e) => e.currentTarget.blur()}
        className="w-24 px-2 py-1.5 text-sm border border-zinc-200 rounded bg-white focus:border-ardal focus:outline-none font-mono tabular-nums"
      />
      {unit && <span className="text-xs text-zinc-400">{unit}</span>}
      <button
        onClick={() => save(Number(value))}
        disabled={status === "saving"}
        className="px-3 py-1.5 text-xs font-medium bg-ardal text-white rounded hover:bg-ardal-dark disabled:opacity-50"
        style={{ transition: "all 0.15s" }}
      >
        Guardar
      </button>
      <SaveIndicator status={status} />
    </div>
  );
}

// String setting editor
function StringEditor({
  settingKey,
  initialValue,
  placeholder,
  type = "text",
}: {
  settingKey: string;
  initialValue: string;
  placeholder?: string;
  type?: string;
}) {
  const [value, setValue] = useState(initialValue);
  const { status, save } = useSaveSetting(settingKey);

  return (
    <div className="flex items-center gap-3">
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 max-w-xs px-2 py-1.5 text-sm border border-zinc-200 rounded bg-white focus:border-ardal focus:outline-none"
      />
      <button
        onClick={() => save(value)}
        disabled={status === "saving"}
        className="px-3 py-1.5 text-xs font-medium bg-ardal text-white rounded hover:bg-ardal-dark disabled:opacity-50"
        style={{ transition: "all 0.15s" }}
      >
        Guardar
      </button>
      <SaveIndicator status={status} />
    </div>
  );
}

type SettingSection = {
  icon: React.ReactNode;
  title: string;
  description: string;
  content: React.ReactNode;
};

export function ConfiguracionView({ settings }: { settings: AppSettings }) {
  const sections: SettingSection[] = [
    {
      icon: <Users size={14} className="text-ardal" />,
      title: "Supervisores",
      description: "Lista de supervisores disponibles en el encabezado del reporte.",
      content: (
        <StringListEditor
          settingKey="supervisores"
          initialValues={settings.supervisores}
        />
      ),
    },
    {
      icon: <Gear size={14} className="text-ardal" />,
      title: "Turnos",
      description: "Turnos disponibles para seleccionar en el encabezado.",
      content: (
        <StringListEditor settingKey="turnos" initialValues={settings.turnos} />
      ),
    },
    {
      icon: <Truck size={14} className="text-ardal" />,
      title: "Operarios / Autoelevadoristas",
      description: "Personal disponible para asignar en autoelevadores y otras secciones.",
      content: (
        <StringListEditor
          settingKey="operarios"
          initialValues={settings.operarios}
        />
      ),
    },
    {
      icon: <ClipboardText size={14} className="text-ardal" />,
      title: "Motivos de ausencia",
      description: "Códigos de motivo de ausencia del personal.",
      content: (
        <StringListEditor
          settingKey="motivos_ausencia"
          initialValues={settings.motivosAusencia}
        />
      ),
    },
    {
      icon: <Briefcase size={14} className="text-ardal" />,
      title: "Puestos de trabajo",
      description: "Puestos disponibles para cambios de puesto en sección personal.",
      content: (
        <StringListEditor
          settingKey="puestos"
          initialValues={settings.puestos}
        />
      ),
    },
    {
      icon: <ChartBar size={14} className="text-ardal" />,
      title: "Objetivos de producción",
      description: "Metas de referencia para el molino y sala de colado.",
      content: (
        <div className="space-y-4">
          <div>
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.08em] mb-2">
              Moldes colados / turno
            </p>
            <NumberEditor
              settingKey="objetivo_moldes_colados"
              initialValue={settings.objetivoMoldesColados}
              unit="moldes"
            />
          </div>
          <div className="border-t border-zinc-100 pt-4">
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.08em] mb-2">
              Rendimiento molino
            </p>
            <NumberEditor
              settingKey="objetivo_rendimiento_hora"
              initialValue={settings.objetivoRendimientoHora}
              unit="CM/hora"
            />
          </div>
        </div>
      ),
    },
    {
      icon: <Envelope size={14} className="text-ardal" />,
      title: "Email destinatario",
      description: "Dirección de email a la que se envían los reportes de fin de turno.",
      content: (
        <StringEditor
          settingKey="email_to"
          initialValue={settings.emailTo}
          placeholder="destinatario@ardal.com.ar"
          type="email"
        />
      ),
    },
  ];

  return (
    <div className="min-h-[100dvh] bg-zinc-50 flex flex-col">
      {/* Header */}
      <header className="bg-zinc-950 border-b border-zinc-800 px-4 md:px-6 py-3 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-ardal shrink-0" />
            <span className="text-white font-bold text-sm tracking-tight">FDT</span>
            <span className="text-zinc-500 text-xs hidden sm:inline">Configuración</span>
          </div>
          <a
            href="/fdt"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white rounded border border-zinc-800 hover:border-zinc-600"
            style={{ transition: "all 0.15s" }}
          >
            <ArrowLeft size={12} />
            Volver al formulario
          </a>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 md:px-6 py-8 space-y-0">
        <div className="mb-6">
          <h1 className="text-sm font-semibold text-zinc-800">Configuración</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Cambios aplicados en tiempo real para todos los usuarios.
          </p>
        </div>

        <div className="divide-y divide-zinc-200">
          {sections.map((section, i) => (
            <div key={i} className="py-6 grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-6">
              {/* Left: label */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {section.icon}
                  <p className="text-sm font-semibold text-zinc-800">
                    {section.title}
                  </p>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {section.description}
                </p>
              </div>
              {/* Right: editor */}
              <div>{section.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
