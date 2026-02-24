"use client";

import { SectionCard } from "@/components/ui/SectionCard";
import { TextAreaField } from "@/components/ui/TextAreaField";

export function SeccionCaldera() {
  return (
    <SectionCard title="Caldera">
      <TextAreaField name="caldera.demoras" label="Demoras" />
      <TextAreaField name="caldera.mantenimiento" label="Mantenimiento" />
      <TextAreaField name="caldera.limpieza" label="Limpieza" />
      <TextAreaField name="caldera.comentarios" label="Comentarios" />
    </SectionCard>
  );
}
