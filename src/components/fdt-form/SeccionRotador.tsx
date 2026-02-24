"use client";

import { SectionCard } from "@/components/ui/SectionCard";
import { FormField } from "@/components/ui/FormField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { DynamicList } from "@/components/ui/DynamicList";

export function SeccionRotador() {
  return (
    <SectionCard title="Rotador">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField name="rotador.arrastreNylon" label="Arrastre de nylon orden" />
        <FormField name="rotador.moldeFisurado" label="Molde fisurado orden" />
      </div>

      <div className="border-t pt-4 mt-2">
        <DynamicList
          name="rotador.columnasEncimado"
          maxItems={4}
          label="Columna de encimado"
          newItem={() => ({ numero: "", defecto: "" })}
          renderItem={(index) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <FormField
                name={`rotador.columnasEncimado.${index}.numero`}
                label="Número"
              />
              <FormField
                name={`rotador.columnasEncimado.${index}.defecto`}
                label="Defecto"
              />
            </div>
          )}
        />
      </div>

      <TextAreaField name="rotador.demoras" label="Demoras" />
      <TextAreaField name="rotador.mantenimiento" label="Mantenimiento" />
      <TextAreaField name="rotador.limpieza" label="Limpieza" />
      <TextAreaField name="rotador.comentarios" label="Comentarios" />
    </SectionCard>
  );
}
