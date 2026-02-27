"use client";

import { useFormContext } from "react-hook-form";

interface CheckboxFieldProps {
  name: string;
  label: string;
}

export function CheckboxField({ name, label }: CheckboxFieldProps) {
  const { register } = useFormContext();

  return (
    <div className="flex items-center gap-2.5 py-1">
      <input
        {...register(name)}
        type="checkbox"
        id={name}
        className="w-4 h-4 rounded cursor-pointer accent-[#ea580c]"
      />
      <label
        htmlFor={name}
        className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.08em] cursor-pointer select-none"
      >
        {label}
      </label>
    </div>
  );
}
