"use client";
import { SectionCard } from "@/components/ui/SectionCard";
import { DynamicList } from "@/components/ui/DynamicList";
import { ComboboxField } from "@/components/ui/ComboboxField";
import { FormField } from "@/components/ui/FormField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { useSettings } from "@/contexts/SettingsContext";

export function SeccionAutoelevadores() {
  const { operarios } = useSettings();

  return (
    <SectionCard title="Autoelevadores">
      <DynamicList
        name="autoelevadores.lista"
        label="Operador"
        maxItems={8}
        newItem={() => ({ operador: "", desdeHora: "", hastaHora: "" })}
        renderItem={(i) => (
          <div className="grid grid-cols-3 gap-3">
            <ComboboxField name={`autoelevadores.lista.${i}.operador`} label="Operador" options={operarios} />
            <FormField name={`autoelevadores.lista.${i}.desdeHora`} label="Desde" type="time" />
            <FormField name={`autoelevadores.lista.${i}.hastaHora`} label="Hasta" type="time" />
          </div>
        )}
      />
      <TextAreaField name="autoelevadores.demoras" label="Demoras" />
      <TextAreaField name="autoelevadores.mantenimiento" label="Mantenimiento" />
      <TextAreaField name="autoelevadores.limpieza" label="Limpieza" />
      <TextAreaField name="autoelevadores.comentarios" label="Comentarios" />
    </SectionCard>
  );
}
