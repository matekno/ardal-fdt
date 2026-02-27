"use client";

import { SectionCard } from "@/components/ui/SectionCard";
import { FormField } from "@/components/ui/FormField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { OrdenList } from "@/components/ui/OrdenList";
import { AjustadasField } from "@/components/ui/AjustadasField";

export function SeccionDesmolde() {
  return (
    <SectionCard title="Desmolde">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          name="desmolde.moldesMaquina"
          label="Moldes desmoldado en máquina"
          type="number"
          unit="UN"
        />
        <FormField
          name="desmolde.moldesManual"
          label="Moldes desmoldado manual"
          type="number"
          unit="UN"
        />
      </div>
      <OrdenList name="desmolde.dintelDesmoldado" label="Dintel desmoldado" />
      <OrdenList name="desmolde.fallaAspiracion" label="Falla en aspiración" />
      <OrdenList name="desmolde.fueraMedida" label="Fuera de medida" />
      <AjustadasField name="desmolde.ajustadas1era" label="Unidades ajustadas de 1era" />
      <AjustadasField name="desmolde.ajustadasReproceso" label="Unidades ajustadas reproceso" />
      <TextAreaField name="desmolde.demoras" label="Demoras" />
      <TextAreaField name="desmolde.mantenimiento" label="Mantenimiento" />
      <TextAreaField name="desmolde.limpieza" label="Limpieza" />
      <TextAreaField name="desmolde.comentarios" label="Comentarios" />
    </SectionCard>
  );
}
