"use client";

import { SectionCard } from "@/components/ui/SectionCard";
import { FormField } from "@/components/ui/FormField";

export function SeccionScrap() {
  return (
    <SectionCard title="Scrap" color="red">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          name="scrap.cerradoPct"
          label="Scrap cerrado (desmolde completo)"
          type="number"
          unit="%"
        />
        <FormField
          name="scrap.parcialPct"
          label="Scrap parcial (desmolde incompleto)"
          type="number"
          unit="%"
        />
        <FormField
          name="scrap.moldesPendientes"
          label="Moldes pendientes a desmoldar"
          type="number"
        />
      </div>
    </SectionCard>
  );
}
