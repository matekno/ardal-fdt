"use client";

import { useFieldArray, useFormContext } from "react-hook-form";

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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">{label}</h4>
        <span className="text-xs text-gray-500">
          {fields.length} / {maxItems}
        </span>
      </div>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border border-gray-200 rounded-lg p-3 bg-gray-50 relative"
        >
          <button
            type="button"
            onClick={() => remove(index)}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-lg leading-none"
            title="Quitar"
          >
            &times;
          </button>
          <div className="pr-6">{renderItem(index)}</div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append(newItem())}
        disabled={fields.length >= maxItems}
        className="w-full py-2 px-4 text-sm font-medium text-[#ea580c] border border-dashed border-[#ea580c] rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        + Agregar {label.toLowerCase()}
      </button>
    </div>
  );
}
