"use client";

import { SectionCard } from "@/components/ui/SectionCard";
import { TextAreaField } from "@/components/ui/TextAreaField";

export function SeccionGeneral() {
  return (
    <SectionCard title="General">
      <TextAreaField
        name="general.explicacionNoCumplimiento"
        label="Explicación de no cumplimiento de objetivos"
        placeholder="Describir motivos si no se cumplieron los objetivos..."
      />
      <TextAreaField
        name="general.otrosComentarios"
        label="Otros comentarios"
        placeholder="Comentarios generales del turno..."
      />
    </SectionCard>
  );
}
