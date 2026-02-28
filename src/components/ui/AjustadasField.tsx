"use client";

import { useWatch } from "react-hook-form";
import { CheckboxField } from "./CheckboxField";
import { SelectField } from "./SelectField";
import { FormField } from "./FormField";

interface AjustadasFieldProps {
  name: string;
  label: string;
}

const SIGNOS = ["+", "-"] as const;

export function AjustadasField({ name, label }: AjustadasFieldProps) {
  const activo = useWatch({ name: `${name}.activo` }) as boolean;

  return (
    <div className="space-y-2">
      <CheckboxField name={`${name}.activo`} label={label} />
      {activo && (
        <div className="grid grid-cols-3 gap-3 pl-6">
          <SelectField
            name={`${name}.signo`}
            label="Signo"
            options={SIGNOS}
            placeholder="+ / -"
          />
          <FormField
            name={`${name}.cantidad`}
            label="Cantidad"
            type="number"
            placeholder="Cantidad"
          />
          <FormField
            name={`${name}.medida`}
            label="Medida / descripción"
            placeholder="ej: 15cm"
          />
        </div>
      )}
    </div>
  );
}
