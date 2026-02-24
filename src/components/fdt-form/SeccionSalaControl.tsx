"use client";

import { SectionCard } from "@/components/ui/SectionCard";
import { FormField } from "@/components/ui/FormField";
import { TextAreaField } from "@/components/ui/TextAreaField";

export function SeccionSalaControl() {
  return (
    <SectionCard title="Sala de Control">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField name="salaControl.horaInicio" label="Hora de inicio" unit="HS" />
        <FormField name="salaControl.moldesColados" label="Moldes colados" />
        <FormField name="salaControl.dintelColado" label="Dintel colado orden" />
        <FormField name="salaControl.cambioCemento" label="Cambio de cemento orden" />
        <FormField name="salaControl.cambioCal" label="Cambio de cal orden" />
      </div>
      <TextAreaField name="salaControl.pruebasEnsayos" label="Pruebas / Ensayos" />
      <TextAreaField name="salaControl.demoras" label="Demoras" />
      <TextAreaField name="salaControl.mantenimiento" label="Mantenimiento" />
      <TextAreaField name="salaControl.limpieza" label="Limpieza" />
      <TextAreaField name="salaControl.otros" label="Otros" />
    </SectionCard>
  );
}
