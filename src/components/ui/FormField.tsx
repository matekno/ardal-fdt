"use client";

import { useFormContext } from "react-hook-form";

interface FormFieldProps {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "time";
  unit?: string;
  placeholder?: string;
  required?: boolean;
}

export function FormField({
  name,
  label,
  type = "text",
  unit,
  placeholder,
  required,
}: FormFieldProps) {
  const { register, getFieldState, formState } = useFormContext();
  const { error } = getFieldState(name, formState);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.08em]">
        {label}
        {required && <span className="text-[#ea580c] ml-0.5">*</span>}
      </label>
      <div className="flex items-center gap-2">
        <input
          {...register(name)}
          type={type}
          placeholder={placeholder}
          step={type === "number" ? "any" : undefined}
          className={`flex-1 ${error ? "border-red-400 bg-red-50" : ""}`}
        />
        {unit && (
          <span className="text-[11px] text-zinc-400 font-mono shrink-0 min-w-[32px]">
            {unit}
          </span>
        )}
      </div>
      {error && (
        <p className="text-[11px] text-red-500 font-medium">
          {error.message ?? "Campo requerido"}
        </p>
      )}
    </div>
  );
}
