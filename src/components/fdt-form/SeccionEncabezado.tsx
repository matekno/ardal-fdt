"use client";

import { useFormContext } from "react-hook-form";
import { SectionCard } from "@/components/ui/SectionCard";
import { SelectField } from "@/components/ui/SelectField";
import { useSettings } from "@/contexts/SettingsContext";
import type { Report } from "@/lib/schema";

export function SeccionEncabezado() {
  const {
    register,
    formState: { errors },
  } = useFormContext<Report>();
  const { turnos, supervisores } = useSettings();

  return (
    <SectionCard title="Encabezado" subtitle="Datos obligatorios del turno">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Fecha <span className="text-red-500">*</span>
          </label>
          <input {...register("encabezado.fecha")} type="date" />
          {errors.encabezado?.fecha && (
            <span className="text-xs text-red-500">
              {errors.encabezado.fecha.message}
            </span>
          )}
        </div>

        <SelectField
          name="encabezado.turno"
          label="Turno *"
          options={turnos}
          placeholder="Seleccionar turno..."
        />

        <SelectField
          name="encabezado.supervisor"
          label="Supervisor *"
          options={supervisores}
          placeholder="Seleccionar supervisor..."
        />
      </div>
    </SectionCard>
  );
}
