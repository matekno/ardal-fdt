"use client";

import { useWatch } from "react-hook-form";
import { SectionCard } from "@/components/ui/SectionCard";
import { FormField } from "@/components/ui/FormField";
import { SelectField } from "@/components/ui/SelectField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { AGUA_EN_USO } from "@/lib/constants";
import { useSettings } from "@/contexts/SettingsContext";

export function SeccionMolino() {
  const { objetivoRendimientoHora } = useSettings();
  const rendimientoRaw = useWatch({ name: "molino3.rendimientoHora" });
  const rendimientoNum = rendimientoRaw !== "" && rendimientoRaw !== null && rendimientoRaw !== undefined
    ? Number(rendimientoRaw)
    : null;
  const mostrarCausa = rendimientoNum !== null && !isNaN(rendimientoNum) && rendimientoNum < objetivoRendimientoHora;

  return (
    <SectionCard title="Molino 3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          name="molino3.horasMarcha"
          label="Horas de marcha"
          type="number"
          unit="HS"
          required
        />
        <FormField
          name="molino3.rendimientoHora"
          label="Rendimiento / hora"
          type="number"
          unit="CM"
          required
        />
        <FormField
          name="molino3.cuerposMoliendaKG"
          label="Cuerpos molienda"
          type="number"
          unit="KG"
          required
        />
      </div>

      {mostrarCausa && (
        <TextAreaField
          name="molino3.causaBajoRendimiento"
          label="Causa bajo rendimiento"
          rows={2}
          required
        />
      )}

      <SelectField
        name="molino3.aguaEnUso"
        label="Agua en uso"
        options={AGUA_EN_USO}
      />
      <TextAreaField name="molino3.mantenimiento" label="Mantenimiento" />
      <TextAreaField name="molino3.limpieza" label="Limpieza" />
      <TextAreaField name="molino3.demoras" label="Demoras" />
      <TextAreaField name="molino3.comentarios" label="Comentarios" />
    </SectionCard>
  );
}
