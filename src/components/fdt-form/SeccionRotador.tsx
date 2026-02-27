"use client";

import { SectionCard } from "@/components/ui/SectionCard";
import { OrdenList } from "@/components/ui/OrdenList";

export function SeccionRotador() {
  return (
    <SectionCard title="Rotador">
      <OrdenList name="rotador.arrastreNylon" label="Arrastre de nylon" />
      <OrdenList name="rotador.moldeFisurado" label="Molde fisurado" />
    </SectionCard>
  );
}
