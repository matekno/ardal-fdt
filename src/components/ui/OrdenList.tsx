"use client";

import { DynamicList } from "./DynamicList";
import { FormField } from "./FormField";

interface OrdenListProps {
  name: string;
  label: string;
  maxItems?: number;
}

export function OrdenList({ name, label, maxItems = 5 }: OrdenListProps) {
  return (
    <DynamicList
      name={name}
      label={label}
      maxItems={maxItems}
      newItem={() => ({ valor: null })}
      renderItem={(i) => (
        <FormField
          name={`${name}.${i}.valor`}
          label="Nro orden"
          type="number"
          placeholder="Nro orden"
        />
      )}
    />
  );
}
