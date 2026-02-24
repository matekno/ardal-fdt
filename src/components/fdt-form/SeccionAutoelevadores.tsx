"use client";

import { SectionCard } from "@/components/ui/SectionCard";
import { TextAreaField } from "@/components/ui/TextAreaField";

export function SeccionAutoelevadores() {
  return (
    <SectionCard title="Autoelevadores">
      <TextAreaField
        name="autoelevadores.comentarios"
        label="Comentarios"
      />
    </SectionCard>
  );
}
