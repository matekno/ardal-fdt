"use client";

import { SectionCard } from "@/components/ui/SectionCard";
import { FormField } from "@/components/ui/FormField";
import { TextAreaField } from "@/components/ui/TextAreaField";

export function SeccionPrecurado() {
  return (
    <SectionCard title="Precurado / Autoclaves">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          name="precuradoAutoclaves.moldesPreCurado"
          label="Moldes en sala de pre-curado"
          type="number"
        />
        <FormField
          name="precuradoAutoclaves.moldesATC2"
          label="Moldes en ATC 2"
          type="number"
        />
      </div>
      <TextAreaField name="precuradoAutoclaves.demoras" label="Demoras" />
      <TextAreaField name="precuradoAutoclaves.mantenimiento" label="Mantenimiento" />
      <TextAreaField name="precuradoAutoclaves.limpieza" label="Limpieza" />
      <TextAreaField name="precuradoAutoclaves.comentarios" label="Comentarios" />
    </SectionCard>
  );
}
