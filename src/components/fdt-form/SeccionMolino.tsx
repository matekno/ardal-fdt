"use client";

import { useWatch } from "react-hook-form";
import { SectionCard } from "@/components/ui/SectionCard";
import { FormField } from "@/components/ui/FormField";
import { SelectField } from "@/components/ui/SelectField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { AGUA_EN_USO } from "@/lib/constants";

export function SeccionMolino() {
  const rendimiento = useWatch({ name: "molino3.rendimientoHora" }) as number | null;
  const mostrarCausa = rendimiento !== null && rendimiento !== undefined && rendimiento < 50;

  return (
    <SectionCard title="Molino 3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          name="molino3.horasMarcha"
          label="Horas de marcha"
          type="number"
          unit="HS"
        />
        <FormField
          name="molino3.rendimientoHora"
          label="Rendimiento / hora"
          type="number"
          unit="CM"
        />
        <FormField
          name="molino3.cuerposMoliendaKG"
          label="Cuerpos molienda"
          type="number"
          unit="KG"
        />
      </div>

      {mostrarCausa && (
        <TextAreaField
          name="molino3.causaBajoRendimiento"
          label="Causa bajo rendimiento"
          rows={2}
        />
      )}

      <SelectField
        name="molino3.aguaEnUso"
        label="Agua en uso"
        options={AGUA_EN_USO}
      />
      <TextAreaField name="molino3.mantenimiento" label="Mantenimiento" />
      <TextAreaField name="molino3.limpieza" label="Limpieza" />
    </SectionCard>
  );
}
