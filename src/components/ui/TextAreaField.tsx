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
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <textarea
        {...register(name)}
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  );
}
