"use client";

import { useFormContext } from "react-hook-form";

interface TextAreaFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

export function TextAreaField({
  name,
  label,
  placeholder,
  rows = 3,
  required,
}: TextAreaFieldProps) {
  const { register, getFieldState, formState } = useFormContext();
  const { error } = getFieldState(name, formState);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.08em]">
        {label}
        {required && <span className="text-[#ea580c] ml-0.5">*</span>}
      </label>
      <textarea
        {...register(name)}
        placeholder={placeholder}
        rows={rows}
        className={error ? "border-red-400 bg-red-50" : ""}
      />
      {error && (
        <p className="text-[11px] text-red-500 font-medium">
          {error.message ?? "Campo requerido"}
        </p>
      )}
    </div>
  );
}
