"use client";

import { SectionCard } from "@/components/ui/SectionCard";
import { FormField } from "@/components/ui/FormField";
import { TextAreaField } from "@/components/ui/TextAreaField";

export function SeccionGranallado() {
  return (
    <SectionCard title="Granallado">
      <FormField
        name="granallado.planchasGranalladas"
        label="Planchas granalladas"
        type="number"
      />
      <TextAreaField name="granallado.demoras" label="Demoras" />
      <TextAreaField name="granallado.mantenimiento" label="Mantenimiento" />
      <TextAreaField name="granallado.limpieza" label="Limpieza" />
      <TextAreaField name="granallado.comentarios" label="Comentarios" />
    </SectionCard>
  );
}
