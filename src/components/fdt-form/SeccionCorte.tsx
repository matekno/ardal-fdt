"use client";

import { SectionCard } from "@/components/ui/SectionCard";
import { FormField } from "@/components/ui/FormField";
import { TextAreaField } from "@/components/ui/TextAreaField";

export function SeccionCorte() {
  return (
    <SectionCard title="Corte / Desmantelado">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField name="corteDesmantelado.dintelCortado" label="Dintel cortado orden" />
        <FormField name="corteDesmantelado.moldeFisurado" label="Molde fisurado orden" />
      </div>
      <TextAreaField name="corteDesmantelado.demoras" label="Demoras" />
      <TextAreaField name="corteDesmantelado.mantenimiento" label="Mantenimiento" />
      <TextAreaField name="corteDesmantelado.limpieza" label="Limpieza" />
      <TextAreaField name="corteDesmantelado.comentarios" label="Comentarios" />
    </SectionCard>
  );
}
