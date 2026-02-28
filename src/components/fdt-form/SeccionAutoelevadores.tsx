"use client";

import { SectionCard } from "@/components/ui/SectionCard";
import { DynamicList } from "@/components/ui/DynamicList";
import { SelectField } from "@/components/ui/SelectField";
import { FormField } from "@/components/ui/FormField";
import { OPERARIOS } from "@/lib/constants";

export function SeccionAutoelevadores() {
  return (
    <SectionCard title="Autoelevadores">
      <DynamicList
        name="autoelevadores.lista"
        label="Operador"
        maxItems={8}
        newItem={() => ({ operador: "", desdeHora: "", hastaHora: "" })}
        renderItem={(i) => (
          <div className="grid grid-cols-3 gap-3">
            <SelectField
              name={`autoelevadores.lista.${i}.operador`}
              label="Operador"
              options={OPERARIOS}
            />
            <FormField
              name={`autoelevadores.lista.${i}.desdeHora`}
              label="Desde"
              type="time"
            />
            <FormField
              name={`autoelevadores.lista.${i}.hastaHora`}
              label="Hasta"
              type="time"
            />
          </div>
        )}
      />
    </SectionCard>
  );
}
