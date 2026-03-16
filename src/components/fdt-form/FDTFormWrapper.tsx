"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  reportSchema,
  createEmptyReport,
  compilarResumenMantenimiento,
  encabezadoSchema,
} from "@/lib/schema";
import type { Report } from "@/lib/schema";
import { generateEmailHTML } from "@/lib/email-generator";
import { TABS } from "@/lib/constants";
import { SettingsProvider } from "@/contexts/SettingsContext";
import type { AppSettings } from "@/lib/settings";
import {
  getRequiredFieldsMap,
  getNestedValue,
  isFieldFilled,
} from "@/lib/required-fields";
import {
  ArrowLeft,
  ArrowRight,
  Warning,
  Trash,
  ArrowUUpLeft,
  SquaresFour,
  ChatText,
  Users,
  Gear,
  House,
  Database,
  Sliders,
  Thermometer,
  Scissors,
  ArrowsClockwise,
  FireSimple,
  Drop,
  Wrench,
  Shield,
  Stack,
  Truck,
  Notepad,
  CheckCircle,
  ClockCounterClockwise,
  SpinnerGap,
  FloppyDisk,
  ListChecks,
  Envelope,
  X,
  Circle,
  PaperPlaneTilt,
  type Icon as PhosphorIcon,
} from "@phosphor-icons/react";

import { SeccionEncabezado } from "./SeccionEncabezado";
import { SeccionGeneral } from "./SeccionGeneral";
import { SeccionPersonal } from "./SeccionPersonal";
import { SeccionMolino } from "./SeccionMolino";
import { SeccionStockBarro } from "./SeccionStockBarro";
import { SeccionSalaControl } from "./SeccionSalaControl";
import { SeccionMaduracion } from "./SeccionMaduracion";
import { SeccionCorte } from "./SeccionCorte";
import { SeccionRotador } from "./SeccionRotador";
import { SeccionPrecurado } from "./SeccionPrecurado";
import { SeccionCaldera } from "./SeccionCaldera";
import { SeccionDesmolde } from "./SeccionDesmolde";
import { SeccionGranallado } from "./SeccionGranallado";
import { SeccionScrap } from "./SeccionScrap";
import { SeccionTransformacion } from "./SeccionTransformacion";
import { SeccionAutoelevadores } from "./SeccionAutoelevadores";

const DRAFT_KEY = "fdt-draft";
const LOCK_PREFIX = "fdt-lock-";

type EmitState =
  | "idle"
  | "confirming"
  | "sending"
  | "success"
  | "locked"
  | "error";

type IconComponent = PhosphorIcon;

const SECTION_ICONS: Record<string, IconComponent> = {
  general: ChatText,
  personal: Users,
  molino3: Gear,
  stockBarro: Database,
  salaControl: Sliders,
  maduracion: Thermometer,
  corte: Scissors,
  rotador: ArrowsClockwise,
  precurado: FireSimple,
  caldera: Drop,
  desmolde: Wrench,
  granallado: Shield,
  scrap: Stack,
  transformacion: SquaresFour,
  autoelevadores: Truck,
};

const EMIT_STEPS = [
  "Validando campos",
  "Guardando registro",
  "Enviando mail",
  "Completado",
];

function hasAnyData(obj: Record<string, unknown>): boolean {
  return Object.values(obj).some((v) => {
    if (Array.isArray(v)) return v.length > 0;
    if (v === null || v === undefined) return false;
    if (typeof v === "boolean") return v === true;
    if (typeof v === "string") return v.trim() !== "";
    if (typeof v === "number") return true;
    if (typeof v === "object") return hasAnyData(v as Record<string, unknown>);
    return false;
  });
}

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

/** Returns true if react-hook-form has a validation error at the given path */
function getErrorAtPath(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: FieldErrors<any>,
  path: string[]
): boolean {
  let current: unknown = errors;
  for (const key of path) {
    if (current == null || typeof current !== "object") return false;
    current = (current as Record<string, unknown>)[key];
  }
  return (
    current != null &&
    typeof current === "object" &&
    "message" in (current as object)
  );
}

export function FDTFormWrapper({ settings }: { settings: AppSettings }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("encabezado");
  const [viewMode, setViewMode] = useState<"panel" | "form">("panel");
  const [clearConfirm, setClearConfirm] = useState(false);
  const [homeConfirm, setHomeConfirm] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<Date | null>(null);
  const [emitState, setEmitState] = useState<EmitState>("idle");
  const [emitError, setEmitError] = useState<string | null>(null);
  const [emitStepIndex, setEmitStepIndex] = useState(0);
  const [showRequiredPanel, setShowRequiredPanel] = useState(false);

  const methods = useForm<Report>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(reportSchema) as any,
    defaultValues: createEmptyReport(),
    mode: "onBlur",
  });

  const {
    watch,
    reset,
    formState: { errors },
  } = methods;

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft) as Record<string, unknown>;
        reset({ ...createEmptyReport(), ...parsed });
        // Check if this report was already emitted
        const encObj = parsed?.encabezado as Record<string, string> | undefined;
        const fecha = encObj?.fecha;
        const turno = encObj?.turno;
        if (fecha && turno && localStorage.getItem(`${LOCK_PREFIX}${fecha}-${turno}`)) {
          setEmitState("locked");
        }
      } catch {
        // ignore invalid draft
      }
    }
  }, [reset]);

  // Auto-save to localStorage on every change
  useEffect(() => {
    const sub = watch((data) => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
      setDraftSavedAt(new Date());
    });
    return () => sub.unsubscribe();
  }, [watch]);

  // Reset draftSavedAt indicator after 3s
  useEffect(() => {
    if (!draftSavedAt) return;
    const t = setTimeout(() => setDraftSavedAt(null), 3000);
    return () => clearTimeout(t);
  }, [draftSavedAt]);

  const activeTabIndex = TABS.findIndex((t) => t.id === activeTab);

  const goNext = useCallback(() => {
    if (activeTabIndex < TABS.length - 1) {
      setActiveTab(TABS[activeTabIndex + 1].id);
    }
  }, [activeTabIndex]);

  const goPrev = useCallback(() => {
    if (activeTabIndex > 0) {
      setActiveTab(TABS[activeTabIndex - 1].id);
    }
  }, [activeTabIndex]);

  // Trigger emit validation and show confirmation
  const onEmit = useCallback(() => {
    const raw = methods.getValues();

    const enc = encabezadoSchema.safeParse(raw.encabezado);
    if (!enc.success) {
      setActiveTab("encabezado");
      setViewMode("form");
      methods.trigger("encabezado");
      return;
    }

    const parsed = reportSchema.safeParse(raw);
    if (!parsed.success) {
      setViewMode("form");
      setShowRequiredPanel(true);
      methods.trigger();
      return;
    }

    setEmitState("confirming");
  }, [methods]);

  // Execute the emit: save to DB + send email
  const onEmitConfirm = useCallback(async () => {
    setEmitError(null);
    setEmitState("sending");
    setEmitStepIndex(0);

    const raw = methods.getValues();
    const parsed = reportSchema.safeParse(raw);
    if (!parsed.success) {
      setEmitState("error");
      setEmitError("El formulario tiene errores de validación.");
      return;
    }

    const data = parsed.data;
    data.resumenMantenimiento = compilarResumenMantenimiento(data);

    await sleep(300);
    setEmitStepIndex(1);

    const stepTimer = window.setTimeout(() => setEmitStepIndex(2), 1000);

    try {
      const res = await fetch("/api/reports/emit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      clearTimeout(stepTimer);

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setEmitState("error");
        if (err.error === "ya_emitido") {
          setEmitError("Este reporte ya fue emitido anteriormente.");
        } else if (err.error === "smtp_error") {
          setEmitError(
            "No se pudo enviar el email. Verificá la configuración SMTP."
          );
        } else if (err.error === "email_to_not_configured") {
          setEmitError(
            "El destinatario de email no está configurado. Ir a /configuracion."
          );
        } else {
          setEmitError("Error inesperado al emitir el reporte.");
        }
        return;
      }

      setEmitStepIndex(3);
      await sleep(700);
      setEmitState("success");

      // Lock this report in localStorage
      const { fecha, turno } = data.encabezado;
      localStorage.setItem(`${LOCK_PREFIX}${fecha}-${turno}`, "1");
    } catch {
      clearTimeout(stepTimer);
      setEmitState("error");
      setEmitError("Error de conexión. Verificá tu red e intentá de nuevo.");
    }
  }, [methods]);

  const onClearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    reset(createEmptyReport());
    setClearConfirm(false);
    setViewMode("panel");
    setEmitState("idle");
  };

  /** Limpia lock + borrador y vuelve a un formulario vacío */
  const onNewForm = useCallback(() => {
    const vals = methods.getValues();
    const enc = vals.encabezado as { fecha?: string; turno?: string };
    if (enc?.fecha && enc?.turno) {
      localStorage.removeItem(`${LOCK_PREFIX}${enc.fecha}-${enc.turno}`);
    }
    localStorage.removeItem(DRAFT_KEY);
    reset(createEmptyReport());
    setEmitState("idle");
    setViewMode("panel");
    setActiveTab("encabezado");
  }, [methods, reset]);

  /** Mapa de campos obligatorios usando el umbral de rendimiento de settings */
  const requiredFieldsMap = useMemo(
    () => getRequiredFieldsMap(settings.objetivoRendimientoHora),
    [settings.objetivoRendimientoHora]
  );

  // Calculate progress
  const formData = watch();
  const sectionKeys = TABS.filter((t) => t.id !== "encabezado").map(
    (t) => t.sectionKey
  );
  const filledCount = sectionKeys.filter((key) => {
    const section = (formData as Record<string, unknown>)[key];
    if (!section || typeof section !== "object") return false;
    return hasAnyData(section as Record<string, unknown>);
  }).length;

  const enc = formData.encabezado as
    | { fecha?: string; turno?: string; supervisor?: string }
    | undefined;
  const encabezadoFilled = !!(enc?.fecha && enc?.turno && enc?.supervisor);

  // Calculate incomplete required fields (respects conditional fields)
  const incompleteCount = requiredFieldsMap.reduce((count, section) => {
    return (
      count +
      section.fields.filter((f) => {
        const isRequired =
          !f.condition || f.condition(formData as Record<string, unknown>);
        return (
          isRequired &&
          !isFieldFilled(
            getNestedValue(formData as Record<string, unknown>, f.path)
          )
        );
      }).length
    );
  }, 0);

  // ─── Shared header ────────────────────────────────────────────────────────────
  const isEmitted = emitState === "success" || emitState === "locked";

  const sharedHeader = (
    <header className="bg-zinc-950 border-b border-zinc-800 px-4 md:px-6 py-3 sticky top-0 z-20">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        {/* Brand + context */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#ea580c] shrink-0" />
          <span className="text-white font-bold text-sm tracking-tight shrink-0">
            FDT
          </span>
          {isEmitted ? (
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
              <CheckCircle size={11} weight="fill" />
              Emitido
            </span>
          ) : (
            enc?.turno && (
              <span className="text-zinc-500 text-xs truncate hidden sm:inline">
                {enc.turno.replace("TURNO ", "")}
                {enc.supervisor && ` — ${enc.supervisor.split(" - ")[0]}`}
                {enc.fecha && ` · ${enc.fecha}`}
              </span>
            )
          )}
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Draft saved indicator */}
          {draftSavedAt && !isEmitted && (
            <span
              className="flex items-center gap-1 text-[11px] text-zinc-500"
              style={{ transition: "opacity 0.3s var(--ease-spring)" }}
            >
              <FloppyDisk size={11} />
              <span className="hidden sm:inline">Borrador guardado</span>
            </span>
          )}

          {/* Progress counter */}
          {!isEmitted && (
            <span className="text-xs font-mono tabular-nums text-zinc-500">
              <span className="text-white">
                {filledCount + (encabezadoFilled ? 1 : 0)}
              </span>
              <span className="text-zinc-700">/{TABS.length}</span>
            </span>
          )}

          {/* Required fields toggle (form mode only) */}
          {viewMode === "form" && !isEmitted && (
            <button
              type="button"
              onClick={() => setShowRequiredPanel((v) => !v)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded border ${
                showRequiredPanel
                  ? "text-white border-zinc-600 bg-zinc-800"
                  : "text-zinc-400 hover:text-white border-zinc-800 hover:border-zinc-600"
              }`}
              style={{ transition: "all 0.15s var(--ease-spring)" }}
              title="Verificar campos obligatorios"
            >
              <ListChecks size={12} />
              <span className="hidden sm:inline">Verificar</span>
              {incompleteCount > 0 && (
                <span className="px-1 py-0.5 text-[10px] font-bold bg-[#ea580c] text-white rounded leading-none">
                  {incompleteCount}
                </span>
              )}
            </button>
          )}

          {/* Panel toggle (form mode only) */}
          {viewMode === "form" && !isEmitted && (
            <button
              type="button"
              onClick={() => setViewMode("panel")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-white rounded border border-zinc-800 hover:border-zinc-600"
              style={{ transition: "all 0.15s var(--ease-spring)" }}
            >
              <SquaresFour size={12} />
              <span className="hidden sm:inline">Resumen</span>
            </button>
          )}

          {/* Home — con confirmación */}
          {homeConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">¿Volver al menú?</span>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="text-xs text-white font-medium hover:text-zinc-300"
                style={{ transition: "color 0.15s var(--ease-spring)" }}
              >
                Sí
              </button>
              <button
                type="button"
                onClick={() => setHomeConfirm(false)}
                className="text-xs text-zinc-600 hover:text-zinc-400"
                style={{ transition: "color 0.15s var(--ease-spring)" }}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setHomeConfirm(true)}
              className="p-1.5 text-zinc-600 hover:text-zinc-300 rounded"
              title="Volver al menú inicial"
              style={{ transition: "color 0.15s var(--ease-spring)" }}
            >
              <House size={14} />
            </button>
          )}

          {/* Clear draft (not in emitted state) */}
          {!isEmitted &&
            (clearConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">¿Borrar todo?</span>
                <button
                  type="button"
                  onClick={onClearDraft}
                  className="text-xs text-red-400 font-medium hover:text-red-300"
                  style={{ transition: "color 0.15s var(--ease-spring)" }}
                >
                  Borrar
                </button>
                <button
                  type="button"
                  onClick={() => setClearConfirm(false)}
                  className="text-xs text-zinc-600 hover:text-zinc-400"
                  style={{ transition: "color 0.15s var(--ease-spring)" }}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setClearConfirm(true)}
                className="p-1.5 text-zinc-600 hover:text-red-400 rounded"
                title="Limpiar borrador"
                style={{ transition: "color 0.15s var(--ease-spring)" }}
              >
                <Trash size={14} />
              </button>
            ))}
        </div>
      </div>
    </header>
  );

  // ─── Sending / Error view ──────────────────────────────────────────────────────
  if (emitState === "sending" || emitState === "error") {
    const isError = emitState === "error";
    return (
      <SettingsProvider settings={settings}>
        <div className="min-h-[100dvh] bg-zinc-50 flex flex-col">
          {sharedHeader}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-sm space-y-6">
              <div className="space-y-3">
                {EMIT_STEPS.map((step, i) => {
                  const isDone = emitStepIndex > i;
                  const isActive = emitStepIndex === i && !isError;
                  const isErrorStep = isError && emitStepIndex === i;
                  return (
                    <div key={step} className="flex items-center gap-3">
                      <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                        {isDone ? (
                          <CheckCircle
                            size={18}
                            weight="fill"
                            className="text-emerald-500"
                          />
                        ) : isErrorStep ? (
                          <Warning
                            size={18}
                            weight="fill"
                            className="text-red-400"
                          />
                        ) : isActive ? (
                          <SpinnerGap
                            size={18}
                            className="text-[#ea580c] animate-spin"
                          />
                        ) : (
                          <Circle size={18} className="text-zinc-300" />
                        )}
                      </div>
                      <span
                        className={`text-sm ${
                          isDone
                            ? "text-zinc-400 line-through"
                            : isActive
                              ? "text-zinc-900 font-medium"
                              : isErrorStep
                                ? "text-red-500 font-medium"
                                : "text-zinc-300"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>

              {isError && emitError && (
                <div className="space-y-3">
                  <p className="text-sm text-red-600 flex gap-2 items-start border-l-[3px] border-red-400 pl-3">
                    <Warning
                      size={14}
                      weight="fill"
                      className="shrink-0 mt-0.5"
                    />
                    {emitError}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEmitState("confirming");
                        setEmitError(null);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-[#ea580c] text-white rounded hover:bg-[#c2410c]"
                      style={{ transition: "all 0.15s var(--ease-spring)" }}
                    >
                      Reintentar
                    </button>
                    <button
                      onClick={() => {
                        setEmitState("idle");
                        setEmitError(null);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-zinc-600 bg-zinc-100 rounded hover:bg-zinc-200"
                      style={{ transition: "all 0.15s var(--ease-spring)" }}
                    >
                      <ArrowUUpLeft size={14} />
                      Volver
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SettingsProvider>
    );
  }

  // ─── Success / Locked view ────────────────────────────────────────────────────
  if (emitState === "success" || emitState === "locked") {
    const emailHTML = generateEmailHTML(methods.getValues() as Report);
    return (
      <SettingsProvider settings={settings}>
        <div className="min-h-[100dvh] bg-zinc-50 flex flex-col">
          {sharedHeader}
          <div className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-6 py-6 space-y-5">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-zinc-200">
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
                <CheckCircle size={16} weight="fill" />
                {emitState === "success"
                  ? "Reporte emitido — el email fue enviado"
                  : "Reporte emitido — solo lectura"}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onNewForm}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded hover:border-zinc-300 hover:text-zinc-900"
                  style={{ transition: "all 0.15s var(--ease-spring)" }}
                >
                  <ArrowUUpLeft size={14} />
                  Nuevo turno
                </button>
                <a
                  href="/historial"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded hover:border-zinc-300 hover:text-zinc-900"
                  style={{ transition: "all 0.15s var(--ease-spring)" }}
                >
                  <ClockCounterClockwise size={14} />
                  Ver en historial
                </a>
              </div>
            </div>
            <div
              className="bg-white border border-zinc-200 rounded overflow-hidden"
              dangerouslySetInnerHTML={{ __html: emailHTML }}
            />
          </div>
        </div>
      </SettingsProvider>
    );
  }

  // ─── Panel mode ──────────────────────────────────────────────────────────────
  if (viewMode === "panel") {
    const encTabDef = TABS.find((t) => t.id === "encabezado")!;
    const sectionTabs = TABS.filter((t) => t.id !== "encabezado");

    return (
      <SettingsProvider settings={settings}>
        <div className="min-h-[100dvh] flex flex-col bg-zinc-50">
          {sharedHeader}
          <div className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-6 py-6 space-y-6">
            <div>
              <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-[0.08em] mb-3">
                Requerido
              </p>
              <button
                onClick={() => {
                  setActiveTab(encTabDef.id);
                  setViewMode("form");
                }}
                className={`w-full flex items-center justify-between px-5 py-4 border rounded-md text-left ${
                  encabezadoFilled
                    ? "border-emerald-200 bg-emerald-50/50 hover:border-emerald-300"
                    : "border-[#ea580c]/40 bg-[#ea580c]/[0.03] hover:border-[#ea580c]/70"
                } active:scale-[0.99]`}
                style={{ transition: "all 0.15s var(--ease-spring)" }}
              >
                <div className="flex items-center gap-4">
                  <Notepad
                    size={20}
                    className={
                      encabezadoFilled ? "text-emerald-500" : "text-[#ea580c]"
                    }
                  />
                  <div>
                    <p className="text-sm font-semibold text-zinc-800 leading-tight">
                      Encabezado
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {encabezadoFilled
                        ? `${enc?.turno?.replace("TURNO ", "") ?? ""} — ${enc?.supervisor?.split(" - ")[0] ?? ""} · ${enc?.fecha ?? ""}`
                        : "Fecha, turno y supervisor — completar primero"}
                    </p>
                  </div>
                </div>
                {encabezadoFilled ? (
                  <CheckCircle
                    size={18}
                    className="text-emerald-500 shrink-0"
                    weight="fill"
                  />
                ) : (
                  <ArrowRight size={16} className="text-[#ea580c] shrink-0" />
                )}
              </button>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-[0.08em] mb-3">
                Novedades
                {filledCount > 0 && (
                  <span className="ml-2 text-zinc-600">
                    {filledCount} de {sectionKeys.length} con datos
                  </span>
                )}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {sectionTabs.map((tab) => {
                  const Icon: IconComponent = SECTION_ICONS[tab.id] ?? Notepad;
                  const sectionData = (formData as Record<string, unknown>)[
                    tab.sectionKey
                  ];
                  const hasFilled =
                    !!sectionData &&
                    typeof sectionData === "object" &&
                    hasAnyData(sectionData as Record<string, unknown>);

                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setViewMode("form");
                      }}
                      className={`relative flex flex-col gap-3 p-4 border rounded-md text-left ${
                        hasFilled
                          ? "border-[#ea580c]/30 bg-[#ea580c]/[0.03] hover:border-[#ea580c]/50"
                          : "border-zinc-200 bg-white hover:border-zinc-300"
                      } active:scale-[0.97]`}
                      style={{ transition: "all 0.15s var(--ease-spring)" }}
                    >
                      <div className="flex items-start justify-between">
                        <Icon
                          size={18}
                          className={
                            hasFilled ? "text-[#ea580c]" : "text-zinc-300"
                          }
                        />
                        {hasFilled && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-0.5 shrink-0" />
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-zinc-600 uppercase tracking-[0.08em] leading-tight">
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Emitir CTA */}
            {encabezadoFilled && (
              <div className="flex justify-end pt-2 border-t border-zinc-200">
                <button
                  onClick={onEmit}
                  className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium bg-[#ea580c] text-white rounded hover:bg-[#c2410c] active:scale-[0.98] active:translate-y-[1px]"
                  style={{ transition: "all 0.15s var(--ease-spring)" }}
                >
                  <PaperPlaneTilt size={14} />
                  Emitir reporte
                </button>
              </div>
            )}
          </div>
        </div>
      </SettingsProvider>
    );
  }

  // ─── Form / tabs mode ─────────────────────────────────────────────────────────
  return (
    <SettingsProvider settings={settings}>
      <FormProvider {...methods}>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="h-[100dvh] flex flex-col bg-zinc-50"
        >
          {sharedHeader}

          {/* Tab strip */}
          <div className="bg-white border-b border-zinc-200 sticky top-[49px] z-10">
            <div className="max-w-5xl mx-auto px-4 md:px-6">
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-[0.08em] pt-2">
                Secciones con novedades
              </p>
              <div className="flex overflow-x-auto scrollbar-hide">
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const sectionData = (formData as Record<string, unknown>)[
                    tab.sectionKey
                  ];
                  const hasFilled: boolean =
                    tab.id !== "encabezado" &&
                    !!sectionData &&
                    typeof sectionData === "object" &&
                    hasAnyData(sectionData as Record<string, unknown>);

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center gap-1.5 px-3 py-3 text-xs font-medium whitespace-nowrap border-b-2 shrink-0 ${
                        isActive
                          ? "border-[#ea580c] text-zinc-900"
                          : "border-transparent text-zinc-400 hover:text-zinc-700 hover:border-zinc-300"
                      }`}
                      style={{
                        transition:
                          "color 0.15s var(--ease-spring), border-color 0.15s var(--ease-spring)",
                      }}
                    >
                      {tab.label}
                      {hasFilled && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isActive ? "bg-[#ea580c]" : "bg-emerald-500"
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content + optional required panel */}
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-y-auto min-w-0">
              <div className="max-w-5xl mx-auto w-full px-4 md:px-6 py-6">
                {/* Validation error banner */}
                {Object.keys(errors).length > 0 &&
                  (() => {
                    const errorKeys = Object.keys(errors);
                    const sectionsWithErrors = TABS.filter(
                      (t) =>
                        errorKeys.includes(t.sectionKey) ||
                        errorKeys.includes(t.id)
                    ).map((t) => t.label);
                    return (
                      <div className="mb-5 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        <Warning
                          size={14}
                          className="shrink-0 text-red-500 mt-0.5"
                          weight="bold"
                        />
                        <span>
                          Hay campos con errores.{" "}
                          {sectionsWithErrors.length > 0 && (
                            <span className="font-semibold">
                              Revisá: {sectionsWithErrors.join(", ")}
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })()}

                {/* Active section */}
                <div>
                  {activeTab === "encabezado" && <SeccionEncabezado />}
                  {activeTab === "general" && <SeccionGeneral />}
                  {activeTab === "personal" && <SeccionPersonal />}
                  {activeTab === "molino3" && <SeccionMolino />}
                  {activeTab === "stockBarro" && <SeccionStockBarro />}
                  {activeTab === "salaControl" && <SeccionSalaControl />}
                  {activeTab === "maduracion" && <SeccionMaduracion />}
                  {activeTab === "corte" && <SeccionCorte />}
                  {activeTab === "rotador" && <SeccionRotador />}
                  {activeTab === "precurado" && <SeccionPrecurado />}
                  {activeTab === "caldera" && <SeccionCaldera />}
                  {activeTab === "desmolde" && <SeccionDesmolde />}
                  {activeTab === "granallado" && <SeccionGranallado />}
                  {activeTab === "scrap" && <SeccionScrap />}
                  {activeTab === "transformacion" && <SeccionTransformacion />}
                  {activeTab === "autoelevadores" && <SeccionAutoelevadores />}
                </div>
              </div>
            </div>

            {/* Required fields panel — inline, pushes content */}
            {showRequiredPanel && (
              <aside className="w-72 flex-none bg-zinc-950 border-l border-zinc-800 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-950 shrink-0">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-[0.08em]">
                    Campos obligatorios
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowRequiredPanel(false)}
                    className="p-1 text-zinc-500 hover:text-white rounded"
                    style={{ transition: "color 0.15s var(--ease-spring)" }}
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {requiredFieldsMap.map((section) => {
                    const incomplete = section.fields.filter((f) => {
                      const isRequired =
                        !f.condition ||
                        f.condition(formData as Record<string, unknown>);
                      return (
                        isRequired &&
                        !isFieldFilled(
                          getNestedValue(
                            formData as Record<string, unknown>,
                            f.path
                          )
                        )
                      );
                    });
                    const allDone = incomplete.length === 0;

                    return (
                      <div
                        key={section.sectionId}
                        className="border-b border-zinc-800"
                      >
                        <button
                          type="button"
                          onClick={() => setActiveTab(section.sectionId)}
                          className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-zinc-800 text-left cursor-pointer"
                          style={{
                            transition:
                              "background-color 0.15s var(--ease-spring)",
                          }}
                        >
                          <span
                            className={`text-[11px] font-semibold uppercase tracking-[0.08em] ${
                              allDone ? "text-zinc-500" : "text-zinc-300"
                            }`}
                          >
                            {section.label}
                          </span>
                          {allDone ? (
                            <CheckCircle
                              size={12}
                              weight="fill"
                              className="text-emerald-500 shrink-0"
                            />
                          ) : (
                            <span className="text-[10px] text-[#ea580c] font-mono tabular-nums">
                              {incomplete.length}
                            </span>
                          )}
                        </button>

                        <div className="divide-y divide-zinc-800/50">
                          {section.fields.map((field) => {
                            // Skip conditional fields whose condition isn't met
                            const isRequired =
                              !field.condition ||
                              field.condition(
                                formData as Record<string, unknown>
                              );
                            if (!isRequired) return null;

                            const val = getNestedValue(
                              formData as Record<string, unknown>,
                              field.path
                            );
                            const filled = isFieldFilled(val);
                            const hasError = getErrorAtPath(
                              errors,
                              field.path
                            );
                            return (
                              <button
                                key={field.path.join(".")}
                                type="button"
                                onClick={() =>
                                  setActiveTab(section.sectionId)
                                }
                                className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-zinc-800 text-left cursor-pointer"
                                style={{
                                  transition:
                                    "background-color 0.15s var(--ease-spring)",
                                }}
                              >
                                {hasError ? (
                                  <Warning
                                    size={12}
                                    weight="fill"
                                    className="text-red-400 shrink-0"
                                  />
                                ) : filled ? (
                                  <CheckCircle
                                    size={12}
                                    weight="fill"
                                    className="text-emerald-500 shrink-0"
                                  />
                                ) : (
                                  <Circle
                                    size={12}
                                    className="text-zinc-600 shrink-0"
                                  />
                                )}
                                <span
                                  className={`text-xs ${
                                    hasError
                                      ? "text-red-400"
                                      : filled
                                        ? "text-zinc-600 line-through"
                                        : "text-zinc-400"
                                  }`}
                                >
                                  {field.label}
                                </span>
                                {filled && !hasError && (
                                  <span className="ml-auto text-[10px] text-zinc-600 font-mono tabular-nums truncate max-w-[60px]">
                                    {String(val)}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="px-4 py-3 border-t border-zinc-800">
                  {incompleteCount === 0 ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                      <CheckCircle size={12} weight="fill" />
                      Todos los campos completos
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <Warning
                        size={12}
                        weight="fill"
                        className="text-[#ea580c]"
                      />
                      {incompleteCount} campo
                      {incompleteCount !== 1 ? "s" : ""} sin completar
                    </div>
                  )}
                </div>
              </aside>
            )}
          </div>

          {/* Footer navigation */}
          <footer className="bg-white border-t border-zinc-200 sticky bottom-0 z-10">
            <div className="max-w-5xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={goPrev}
                disabled={activeTabIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-zinc-600 bg-zinc-100 rounded hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ transition: "all 0.15s var(--ease-spring)" }}
              >
                <ArrowLeft size={14} />
                Anterior
              </button>

              <span className="text-xs text-zinc-400 font-mono tabular-nums hidden sm:block">
                {activeTabIndex + 1} / {TABS.length}
              </span>

              <div className="flex items-center gap-2">
                {/* Siguiente — hidden on last tab */}
                {activeTabIndex < TABS.length - 1 && (
                  <button
                    type="button"
                    onClick={goNext}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-zinc-600 bg-zinc-100 rounded hover:bg-zinc-200"
                    style={{ transition: "all 0.15s var(--ease-spring)" }}
                  >
                    Siguiente
                    <ArrowRight size={14} />
                  </button>
                )}

                {/* Emitir — always present, primary style on last tab */}
                <button
                  type="button"
                  onClick={onEmit}
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded active:scale-[0.98] active:translate-y-[1px] ${
                    activeTabIndex === TABS.length - 1
                      ? "bg-[#ea580c] text-white hover:bg-[#c2410c]"
                      : "border border-[#ea580c] text-[#ea580c] hover:bg-[#ea580c]/5"
                  }`}
                  style={{ transition: "all 0.15s var(--ease-spring)" }}
                >
                  <Envelope size={14} />
                  Emitir
                </button>
              </div>
            </div>
          </footer>
        </form>
      </FormProvider>

      {/* Emit confirmation modal */}
      {emitState === "confirming" && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          style={{ backdropFilter: "blur(2px)" }}
        >
          <div className="bg-white rounded border border-zinc-200 p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center gap-2">
              <PaperPlaneTilt size={16} className="text-[#ea580c] shrink-0" />
              <p className="text-sm font-semibold text-zinc-800">
                Confirmar emisión del reporte
              </p>
            </div>

            <div className="text-[11px] text-zinc-500 space-y-1 border-l-[3px] border-[#ea580c] pl-3">
              <p className="font-medium text-zinc-700">
                {enc?.turno} · {enc?.fecha}
              </p>
              <p>
                Supervisor:{" "}
                {enc?.supervisor?.split(" - ").slice(1).join(" - ") ||
                  enc?.supervisor}
              </p>
              <p>
                {filledCount + 1} sección
                {filledCount + 1 !== 1 ? "es" : ""} con datos
              </p>
              <p>Para: {settings.emailTo || "no configurado"}</p>
            </div>

            <p className="text-[11px] text-red-500 flex gap-1.5 items-start">
              <Warning size={11} weight="fill" className="mt-0.5 shrink-0" />
              Una vez emitido el reporte no podrá modificarse.
            </p>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setEmitState("idle")}
                className="flex-1 px-4 py-2 text-sm font-medium text-zinc-600 bg-zinc-100 rounded hover:bg-zinc-200"
                style={{ transition: "all 0.15s var(--ease-spring)" }}
              >
                Cancelar
              </button>
              <button
                onClick={onEmitConfirm}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium bg-[#ea580c] text-white rounded hover:bg-[#c2410c] active:scale-[0.98]"
                style={{ transition: "all 0.15s var(--ease-spring)" }}
              >
                <PaperPlaneTilt size={14} />
                Emitir reporte
              </button>
            </div>
          </div>
        </div>
      )}
    </SettingsProvider>
  );
}
