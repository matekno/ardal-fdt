"use client";

import { SectionCard } from "@/components/ui/SectionCard";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { OrdenList } from "@/components/ui/OrdenList";

export function SeccionCorte() {
  return (
    <SectionCard title="Corte / Desmantelado">
      <OrdenList name="corteDesmantelado.dintelCortado" label="Dintel cortado" />
      <OrdenList name="corteDesmantelado.moldeFisurado" label="Molde fisurado" />
      <TextAreaField name="corteDesmantelado.demoras" label="Demoras" />
      <TextAreaField name="corteDesmantelado.mantenimiento" label="Mantenimiento" />
      <TextAreaField name="corteDesmantelado.limpieza" label="Limpieza" />
      <TextAreaField name="corteDesmantelado.comentarios" label="Comentarios" />
    </SectionCard>
  );
}
