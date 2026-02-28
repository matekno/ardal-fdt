"use client";

import { useWatch } from "react-hook-form";
import { SectionCard } from "@/components/ui/SectionCard";
import { FormField } from "@/components/ui/FormField";
import { TextAreaField } from "@/components/ui/TextAreaField";

export function SeccionPrecurado() {
  const precu = useWatch({ name: "precuradoAutoclaves.moldesPreCurado" });
  const atc2 = useWatch({ name: "precuradoAutoclaves.moldesATC2" });
  const mostrarEnVias = Number(precu) === 12 && Number(atc2) === 12;

  return (
    <SectionCard title="Precurado / Autoclaves">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          name="precuradoAutoclaves.moldesPreCurado"
          label="Moldes en sala de pre-curado"
          type="number"
          unit="UN"
          required
        />
        <FormField
          name="precuradoAutoclaves.moldesATC2"
          label="Moldes en ATC 2"
          type="number"
          unit="UN"
          required
        />
      </div>
      {mostrarEnVias && (
        <FormField
          name="precuradoAutoclaves.moldesEnVias"
          label="Moldes en vías"
          type="number"
          unit="UN"
        />
      )}
      <TextAreaField name="precuradoAutoclaves.demoras" label="Demoras" />
      <TextAreaField name="precuradoAutoclaves.mantenimiento" label="Mantenimiento" />
      <TextAreaField name="precuradoAutoclaves.limpieza" label="Limpieza" />
      <TextAreaField name="precuradoAutoclaves.comentarios" label="Comentarios" />
    </SectionCard>
  );
}
