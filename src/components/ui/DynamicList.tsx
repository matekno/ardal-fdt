"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { X, Plus } from "@phosphor-icons/react";

interface DynamicListProps {
  name: string;
  maxItems: number;
  label: string;
  renderItem: (index: number) => React.ReactNode;
  newItem: () => Record<string, unknown>;
}

export function DynamicList({
  name,
  maxItems,
  label,
  renderItem,
  newItem,
}: DynamicListProps) {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <h4 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.08em]">
          {label}
        </h4>
        <span className="text-[10px] text-zinc-400 font-mono tabular-nums">
          {fields.length}/{maxItems}
        </span>
      </div>

      {fields.length > 0 && (
        <div className="divide-y divide-zinc-100 mb-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-start gap-2 group py-3 first:pt-0"
            >
              <div className="flex-1 min-w-0">{renderItem(index)}</div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="shrink-0 p-1 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 rounded mt-0.5"
                style={{ transition: "all 0.15s var(--ease-spring)" }}
                title="Quitar"
              >
                <X size={13} weight="bold" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => append(newItem())}
        disabled={fields.length >= maxItems}
        className="flex items-center gap-1.5 text-[12px] font-medium text-[#ea580c] hover:text-[#c2410c] disabled:opacity-40 disabled:cursor-not-allowed py-1"
        style={{ transition: "color 0.15s var(--ease-spring)" }}
      >
        <Plus size={12} weight="bold" />
        Agregar {label.toLowerCase()}
      </button>
    </div>
  );
}
