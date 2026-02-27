"use client";

import { SectionCard } from "@/components/ui/SectionCard";
import { FormField } from "@/components/ui/FormField";
import { CheckboxField } from "@/components/ui/CheckboxField";
import { TextAreaField } from "@/components/ui/TextAreaField";

export function SeccionDesmolde() {
  return (
    <SectionCard title="Desmolde">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          name="desmolde.moldesMaquina"
          label="Moldes desmoldado en máquina"
          type="number"
          unit="UN"
        />
        <FormField
          name="desmolde.moldesManual"
          label="Moldes desmoldado manual"
          type="number"
          unit="UN"
        />
        <FormField name="desmolde.dintelDesmoldado" label="Dintel desmoldado orden" />
        <FormField name="desmolde.fallaAspiracion" label="Falla en aspiración orden" />
        <FormField name="desmolde.fueraMedida" label="Fuera de medida orden" />
      </div>
      <div className="flex gap-6 pt-1">
        <CheckboxField
          name="desmolde.ajustadas1era"
          label="Unidades ajustadas de 1era"
        />
        <CheckboxField
          name="desmolde.ajustadasReproceso"
          label="Unidades ajustadas reproceso"
        />
      </div>
      <TextAreaField name="desmolde.demoras" label="Demoras" />
      <TextAreaField name="desmolde.mantenimiento" label="Mantenimiento" />
      <TextAreaField name="desmolde.limpieza" label="Limpieza" />
      <TextAreaField name="desmolde.comentarios" label="Comentarios" />
    </SectionCard>
  );
}
