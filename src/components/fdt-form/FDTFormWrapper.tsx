"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reportSchema, createEmptyReport, compilarResumenMantenimiento, encabezadoSchema } from "@/lib/schema";
import type { Report } from "@/lib/schema";
import { generateEmailHTML } from "@/lib/email-generator";
import { TABS } from "@/lib/constants";
import { ArrowLeft, ArrowRight, Envelope, Warning, Trash, ArrowUUpLeft } from "@phosphor-icons/react";

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

function hasAnyData(obj: Record<string, unknown>): boolean {
  return Object.values(obj).some((v) => {
    if (Array.isArray(v)) return v.length > 0;
    if (v === null || v === undefined) return false;
    if (typeof v === "string") return v.trim() !== "";
    if (typeof v === "number") return true;
    if (typeof v === "object") return hasAnyData(v as Record<string, unknown>);
    return false;
  });
}

export function FDTFormWrapper() {
  const [activeTab, setActiveTab] = useState("encabezado");
  const [previewHTML, setPreviewHTML] = useState<string | null>(null);
  const [clearConfirm, setClearConfirm] = useState(false);

  const methods = useForm<Report>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(reportSchema) as any,
    defaultValues: createEmptyReport(),
  });

  const { watch, reset, formState: { errors } } = methods;

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        reset({ ...createEmptyReport(), ...parsed });
      } catch {
        // ignore invalid draft
      }
    }
  }, [reset]);

  // Auto-save to localStorage every 30s
  useEffect(() => {
    const sub = watch((data) => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    });
    return () => sub.unsubscribe();
  }, [watch]);

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

  const onPreview = () => {
    const raw = methods.getValues();

    // Solo validar encabezado
    const enc = encabezadoSchema.safeParse(raw.encabezado);
    if (!enc.success) {
      setActiveTab("encabezado");
      methods.trigger("encabezado");
      return;
    }

    // Parsear con el schema completo (coerce números)
    const parsed = reportSchema.safeParse(raw);
    const data = parsed.success ? parsed.data : (raw as Report);

    data.resumenMantenimiento = compilarResumenMantenimiento(data);
    const html = generateEmailHTML(data);
    setPreviewHTML(html);
  };

  const onClearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    reset(createEmptyReport());
    setClearConfirm(false);
  };

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

  // Encabezado info for header display
  const enc = formData.encabezado as
    | { fecha?: string; turno?: string; supervisor?: string }
    | undefined;

  if (previewHTML) {
    return (
      <div className="min-h-[100dvh] bg-zinc-50 flex flex-col">
        {/* Preview header */}
        <header className="bg-zinc-950 border-b border-zinc-800 px-4 md:px-6 py-3 sticky top-0 z-20">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#ea580c] shrink-0" />
              <span className="text-white font-bold text-sm tracking-tight">FDT</span>
              <span className="text-zinc-500 text-xs hidden sm:inline">
                Vista previa del email
              </span>
            </div>
            <button
              onClick={() => setPreviewHTML(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white rounded border border-zinc-700 hover:border-zinc-500"
              style={{ transition: "all 0.15s var(--ease-spring)" }}
            >
              <ArrowUUpLeft size={12} />
              Volver al formulario
            </button>
          </div>
        </header>
        <div className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-6 py-6">
          <div
            className="bg-white rounded border border-zinc-200 overflow-hidden"
            dangerouslySetInnerHTML={{ __html: previewHTML }}
          />
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="min-h-[100dvh] flex flex-col bg-zinc-50"
      >
        {/* Top header bar */}
        <header className="bg-zinc-950 border-b border-zinc-800 px-4 md:px-6 py-3 sticky top-0 z-20">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            {/* Brand + context */}
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[#ea580c] shrink-0" />
              <span className="text-white font-bold text-sm tracking-tight shrink-0">FDT</span>
              {enc?.turno && (
                <span className="text-zinc-500 text-xs truncate hidden sm:inline">
                  {enc.turno.replace("TURNO ", "")}
                  {enc.supervisor && ` — ${enc.supervisor.split(" - ")[0]}`}
                  {enc.fecha && ` · ${enc.fecha}`}
                </span>
              )}
            </div>

            {/* Right: progress + clear */}
            <div className="flex items-center gap-4 shrink-0">
              <span className="text-xs font-mono tabular-nums text-zinc-500">
                <span className="text-white">{filledCount}</span>
                <span className="text-zinc-700">/{sectionKeys.length}</span>
              </span>

              {clearConfirm ? (
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
              )}
            </div>
          </div>
        </header>

        {/* Tab strip */}
        <div className="bg-white border-b border-zinc-200 sticky top-[49px] z-10">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
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

        {/* Content */}
        <div className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-6 py-6">
          {/* Validation error */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-5 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              <Warning size={14} className="shrink-0 text-red-500" weight="bold" />
              Hay errores de validación en Encabezado. Revisá los campos obligatorios.
            </div>
          )}

          {/* Active section */}
          <div>
            {activeTab === "encabezado" && <SeccionEncabezado />}
            {activeTab === "general" && <SeccionGeneral />}
            {activeTab === "personal" && <SeccionPersonal />}
            {activeTab === "molino3" && <SeccionMolino molinoNumber={3} />}
            {activeTab === "molino2" && <SeccionMolino molinoNumber={2} />}
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

            {activeTabIndex === TABS.length - 1 ? (
              <button
                type="button"
                onClick={onPreview}
                className="flex items-center gap-1.5 px-5 py-2 text-sm font-medium bg-[#ea580c] text-white rounded hover:bg-[#c2410c] active:scale-[0.98] active:translate-y-[1px]"
                style={{ transition: "all 0.15s var(--ease-spring)" }}
              >
                <Envelope size={14} />
                Vista previa
              </button>
            ) : (
              <button
                type="button"
                onClick={goNext}
                className="flex items-center gap-1.5 px-5 py-2 text-sm font-medium bg-[#ea580c] text-white rounded hover:bg-[#c2410c] active:scale-[0.98] active:translate-y-[1px]"
                style={{ transition: "all 0.15s var(--ease-spring)" }}
              >
                Siguiente
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </footer>
      </form>
    </FormProvider>
  );
}
