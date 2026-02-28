"use client";

import { useFormContext } from "react-hook-form";

interface SelectFieldProps {
  name: string;
  label: string;
  options: readonly string[];
  placeholder?: string;
  required?: boolean;
}

export function SelectField({
  name,
  label,
  options,
  placeholder = "Seleccionar...",
  required,
}: SelectFieldProps) {
  const { register, getFieldState, formState } = useFormContext();
  const { error } = getFieldState(name, formState);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.08em]">
        {label}
        {required && <span className="text-[#ea580c] ml-0.5">*</span>}
      </label>
      <select
        {...register(name)}
        className={error ? "border-red-400 bg-red-50" : ""}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-[11px] text-red-500 font-medium">
          {error.message ?? "Campo requerido"}
        </p>
      )}
    </div>
  );
}
