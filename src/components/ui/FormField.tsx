"use client";

import { useFormContext } from "react-hook-form";

interface FormFieldProps {
  name: string;
  label: string;
  type?: "text" | "number" | "date";
  unit?: string;
  placeholder?: string;
}

export function FormField({
  name,
  label,
  type = "text",
  unit,
  placeholder,
}: FormFieldProps) {
  const { register } = useFormContext();

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-2">
        <input
          {...register(name)}
          type={type}
          placeholder={placeholder}
          step={type === "number" ? "any" : undefined}
          className="flex-1"
        />
        {unit && (
          <span className="text-sm text-gray-500 font-medium min-w-[40px]">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
