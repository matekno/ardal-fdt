"use client";

import { useFormContext } from "react-hook-form";

interface TextAreaFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
}

export function TextAreaField({
  name,
  label,
  placeholder,
  rows = 3,
}: TextAreaFieldProps) {
  const { register } = useFormContext();

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.08em]">
        {label}
      </label>
      <textarea {...register(name)} placeholder={placeholder} rows={rows} />
    </div>
  );
}
