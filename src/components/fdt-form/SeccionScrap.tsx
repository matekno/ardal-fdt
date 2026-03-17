"use client";

import { useEffect } from "react";
import { useWatch, useFormContext } from "react-hook-form";
import { SectionCard } from "@/components/ui/SectionCard";
import { FormField } from "@/components/ui/FormField";

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

export function SeccionScrap() {
  const { setValue } = useFormContext();
  const cerradoPct = useWatch({ name: "scrap.cerradoPct" });
  const fechaActual = useWatch({ name: "scrap.fechaScrapCerrado" }) as string;

  const tieneCerrado =
    cerradoPct !== null &&
    cerradoPct !== undefined &&
    cerradoPct !== "" &&
    !isNaN(Number(cerradoPct));

  // Auto-rellenar con ayer cuando aparece el campo por primera vez
  useEffect(() => {
    if (tieneCerrado && !fechaActual) {
      setValue("scrap.fechaScrapCerrado", yesterday());
    }
  }, [tieneCerrado, fechaActual, setValue]);

  return (
    <SectionCard title="Scrap" color="red">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <FormField
            name="scrap.cerradoPct"
            label="Scrap cerrado (desmolde completo)"
            type="number"
            unit="%"
          />
          {tieneCerrado && (
            <FormField
              name="scrap.fechaScrapCerrado"
              label="Fecha scrap cerrado"
              type="date"
            />
          )}
        </div>
        <FormField
          name="scrap.parcialPct"
          label="Scrap parcial (desmolde incompleto)"
          type="number"
          unit="%"
          required
        />
        <FormField
          name="scrap.moldesPendientes"
          label="Moldes pendientes a desmoldar"
          type="number"
          unit="moldes"
        />
      </div>
    </SectionCard>
  );
}
