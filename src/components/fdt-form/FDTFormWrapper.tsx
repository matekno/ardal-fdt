"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reportSchema, createEmptyReport, compilarResumenMantenimiento, encabezadoSchema } from "@/lib/schema";
import type { Report } from "@/lib/schema";
import { generateEmailHTML } from "@/lib/email-generator";
import { TABS } from "@/lib/constants";

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
    if (confirm("¿Borrar todos los datos del formulario?")) {
      localStorage.removeItem(DRAFT_KEY);
      reset(createEmptyReport());
    }
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

  if (previewHTML) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Preview del Email
          </h2>
          <button
            onClick={() => setPreviewHTML(null)}
            className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Volver al formulario
          </button>
        </div>
        <div
          className="border border-gray-200 rounded-lg overflow-hidden"
          dangerouslySetInnerHTML={{ __html: previewHTML }}
        />
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="max-w-5xl mx-auto p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fin de Turno</h1>
            <p className="text-gray-500 text-sm">
              Reporte de producción — Ardal / Retak
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {filledCount}/{sectionKeys.length} secciones con datos
            </span>
            <button
              type="button"
              onClick={onClearDraft}
              className="text-xs text-gray-400 hover:text-red-500"
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-2 mb-6 border-b border-gray-200">
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
                className={`px-3 py-2 text-sm font-medium whitespace-nowrap rounded-t-lg transition-colors ${
                  isActive
                    ? "bg-[#ea580c] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
                {hasFilled && !isActive && (
                  <span className="ml-1 text-green-500 text-xs">&#9679;</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Validation errors */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 font-medium">
              Hay errores de validación. Revise los campos obligatorios en
              Encabezado.
            </p>
          </div>
        )}

        {/* Active section */}
        <div className="mb-8">
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

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={goPrev}
            disabled={activeTabIndex === 0}
            className="px-5 py-2.5 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            &larr; Anterior
          </button>

          <div className="flex gap-2">
            {activeTabIndex === TABS.length - 1 ? (
              <button
                type="button"
                onClick={onPreview}
                className="px-6 py-2.5 text-sm font-medium bg-[#ea580c] text-white rounded-lg hover:bg-[#c2410c] transition-colors"
              >
                Preview Email
              </button>
            ) : (
              <button
                type="button"
                onClick={goNext}
                className="px-5 py-2.5 text-sm font-medium bg-[#ea580c] text-white rounded-lg hover:bg-[#c2410c] transition-colors"
              >
                Siguiente &rarr;
              </button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
