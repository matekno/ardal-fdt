"use client";

import { SectionCard } from "@/components/ui/SectionCard";
import { FormField } from "@/components/ui/FormField";
import { TextAreaField } from "@/components/ui/TextAreaField";

export function SeccionStockBarro() {
  return (
    <SectionCard title="Stock de Barro">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField name="stockBarro.arena" label="Arena" type="number" unit="MT" />
        <FormField name="stockBarro.recupero" label="Recupero" type="number" unit="MT" />
      </div>
      <TextAreaField name="stockBarro.comentarios" label="Comentarios" />
      <TextAreaField name="stockBarro.demoras" label="Demoras" />
    </SectionCard>
  );
}
