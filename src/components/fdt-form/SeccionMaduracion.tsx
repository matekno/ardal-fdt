"use client";

import { SectionCard } from "@/components/ui/SectionCard";
import { FormField } from "@/components/ui/FormField";
import { SelectField } from "@/components/ui/SelectField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { OrdenList } from "@/components/ui/OrdenList";
import { CALOVENTORES_MODO } from "@/lib/constants";

export function SeccionMaduracion() {
  return (
    <SectionCard title="Maduración">
      <FormField
        name="maduracion.moldesEnSala"
        label="Moldes en sala a fin de turno"
        type="number"
        unit="UN"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          name="maduracion.caloventoresModo"
          label="Caloventores — Modo"
          options={CALOVENTORES_MODO}
        />
        <FormField
          name="maduracion.caloventoresTemp"
          label="Caloventores — Temperatura"
          type="number"
          unit="°"
        />
      </div>
      <OrdenList name="maduracion.cambioNylon" label="Cambio de nylon" />
      <OrdenList name="maduracion.moldePinchado" label="Molde pinchado" />
      <OrdenList name="maduracion.moldeFisurado" label="Molde fisurado" />
      <TextAreaField name="maduracion.demoras" label="Demoras" />
      <TextAreaField name="maduracion.mantenimiento" label="Mantenimiento" />
      <TextAreaField name="maduracion.limpieza" label="Limpieza" />
      <TextAreaField name="maduracion.comentarios" label="Comentarios" />
    </SectionCard>
  );
}
