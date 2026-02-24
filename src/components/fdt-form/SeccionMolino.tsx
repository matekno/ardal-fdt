"use client";

import { SectionCard } from "@/components/ui/SectionCard";
import { FormField } from "@/components/ui/FormField";
import { SelectField } from "@/components/ui/SelectField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { AGUA_EN_USO, SISTEMA_DOSIFICACION } from "@/lib/constants";

interface SeccionMolinoProps {
  molinoNumber: 2 | 3;
}

export function SeccionMolino({ molinoNumber }: SeccionMolinoProps) {
  const prefix = molinoNumber === 3 ? "molino3" : "molino2";

  return (
    <SectionCard title={`Molino ${molinoNumber}`}>
      {molinoNumber === 3 && (
        <SelectField
          name="molino3.sistemaDosificacion"
          label="Sistema dosificación A/Y"
          options={SISTEMA_DOSIFICACION}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          name={`${prefix}.horasMarcha`}
          label="Horas de marcha"
          type="number"
          unit="HS"
        />
        <FormField
          name={`${prefix}.rendimientoHora`}
          label="Rendimiento / hora"
          type="number"
          unit="CM"
        />
        <FormField
          name={`${prefix}.cuerposMoliendaUN`}
          label="Cuerpos molienda (baldes x 30kg)"
          type="number"
          unit="UN"
        />
        <FormField
          name={`${prefix}.cuerposMoliendaKG`}
          label="Cuerpos molienda"
          type="number"
          unit="KG"
        />
      </div>

      <SelectField
        name={`${prefix}.aguaEnUso`}
        label="Agua en uso"
        options={AGUA_EN_USO}
      />
      <TextAreaField name={`${prefix}.mantenimiento`} label="Mantenimiento" />
      <TextAreaField name={`${prefix}.limpieza`} label="Limpieza" />
    </SectionCard>
  );
}
