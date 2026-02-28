"use client";

import { useWatch } from "react-hook-form";
import { SectionCard } from "@/components/ui/SectionCard";
import { FormField } from "@/components/ui/FormField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { OrdenList } from "@/components/ui/OrdenList";
import { OBJETIVO_MOLDES_COLADOS } from "@/lib/constants";

export function SeccionSalaControl() {
  const moldesColados = useWatch({ name: "salaControl.moldesColados" }) as number | null;

  const desvio =
    moldesColados !== null && moldesColados !== undefined
      ? moldesColados - OBJETIVO_MOLDES_COLADOS
      : null;

  return (
    <SectionCard title="Sala de Colado">
      <FormField
        name="salaControl.horaInicio"
        label="Hora de inicio"
        type="time"
        required
      />

      {/* Moldes colados + badge objetivo */}
      <div className="space-y-1.5">
        <FormField
          name="salaControl.moldesColados"
          label="Moldes colados"
          type="number"
          unit="UN"
          required
        />
        <p className="text-[11px] text-zinc-400 font-mono">
          Objetivo: {OBJETIVO_MOLDES_COLADOS} UN
          {desvio !== null && (
            <span
              className={`ml-2 font-semibold ${
                desvio >= 0 ? "text-emerald-600" : "text-orange-600"
              }`}
            >
              {desvio >= 0
                ? `+${desvio} vs objetivo`
                : `${desvio} vs objetivo`}
            </span>
          )}
        </p>
      </div>

      <OrdenList
        name="salaControl.dintelColado"
        label="Dintel colado"
        maxItems={2}
      />
      <OrdenList name="salaControl.cambioCemento" label="Cambio de cemento" />
      <OrdenList name="salaControl.cambioCal" label="Cambio de cal" />

      <TextAreaField name="salaControl.pruebasEnsayos" label="Pruebas / Ensayos" />
      <TextAreaField name="salaControl.demoras" label="Demoras" />
      <TextAreaField name="salaControl.mantenimiento" label="Mantenimiento" />
      <TextAreaField name="salaControl.limpieza" label="Limpieza" />
      <TextAreaField name="salaControl.otros" label="Otros" />
    </SectionCard>
  );
}
