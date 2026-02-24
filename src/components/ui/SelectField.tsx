"use client";

import { useFormContext } from "react-hook-form";

interface SelectFieldProps {
  name: string;
  label: string;
  options: readonly string[];
  placeholder?: string;
}

export function SelectField({
  name,
  label,
  options,
  placeholder = "Seleccionar...",
}: SelectFieldProps) {
  const { register } = useFormContext();

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select {...register(name)}>
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
