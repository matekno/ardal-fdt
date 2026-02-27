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
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.08em]">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          {...register(name)}
          type={type}
          placeholder={placeholder}
          step={type === "number" ? "any" : undefined}
          className="flex-1"
        />
        {unit && (
          <span className="text-[11px] text-zinc-400 font-mono shrink-0 min-w-[32px]">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
