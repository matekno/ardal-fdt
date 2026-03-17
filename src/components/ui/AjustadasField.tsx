"use client";

import { useWatch, useFieldArray, useFormContext } from "react-hook-form";
import { Plus, X } from "@phosphor-icons/react";
import { CheckboxField } from "./CheckboxField";
import { SelectField } from "./SelectField";
import { FormField } from "./FormField";

interface AjustadasFieldProps {
  name: string;
  label: string;
}

const SIGNOS = ["+", "-"] as const;

export function AjustadasField({ name, label }: AjustadasFieldProps) {
  const { control } = useFormContext();
  const activo = useWatch({ name: `${name}.activo` }) as boolean;
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${name}.lineas`,
  });

  return (
    <div className="space-y-2">
      <CheckboxField name={`${name}.activo`} label={label} />
      {activo && (
        <div className="pl-6 space-y-2">
          {fields.length > 0 && (
            <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-2">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.08em]">Signo</span>
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.08em]">Cantidad</span>
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.08em]">Medida</span>
              <span />
            </div>
          )}
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-start">
              <SelectField
                name={`${name}.lineas.${index}.signo`}
                label=""
                options={SIGNOS}
                placeholder="+ / -"
              />
              <FormField
                name={`${name}.lineas.${index}.cantidad`}
                label=""
                type="number"
              />
              <FormField
                name={`${name}.lineas.${index}.medida`}
                label=""
                placeholder="ej: 15cm"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-1.5 text-zinc-400 hover:text-red-500 rounded transition-colors"
                style={{ transition: "color 0.15s var(--ease-spring)" }}
              >
                <X size={14} weight="bold" />
              </button>
            </div>
          ))}
          {fields.length < 8 && (
            <button
              type="button"
              onClick={() => append({ signo: "", cantidad: null, medida: "" })}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 hover:text-zinc-900 uppercase tracking-[0.08em] transition-colors"
              style={{ transition: "color 0.15s var(--ease-spring)" }}
            >
              <Plus size={12} weight="bold" />
              Agregar línea
            </button>
          )}
        </div>
      )}
    </div>
  );
}
