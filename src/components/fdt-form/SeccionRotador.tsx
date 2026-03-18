"use client";

import { SectionCard } from "@/components/ui/SectionCard";
import { OrdenList } from "@/components/ui/OrdenList";
import { TextAreaField } from "@/components/ui/TextAreaField";

export function SeccionRotador() {
  return (
    <SectionCard title="Rotador">
      <OrdenList name="rotador.arrastreNylon" label="Arrastre de nylon" />
      <OrdenList name="rotador.moldeFisurado" label="Molde fisurado" />
      <TextAreaField name="rotador.demoras" label="Demoras" />
      <TextAreaField name="rotador.mantenimiento" label="Mantenimiento" />
      <TextAreaField name="rotador.limpieza" label="Limpieza" />
      <TextAreaField name="rotador.comentarios" label="Comentarios" />
    </SectionCard>
  );
}
