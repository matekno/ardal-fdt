"use client";

import { SectionCard } from "@/components/ui/SectionCard";
import { FormField } from "@/components/ui/FormField";
import { TextAreaField } from "@/components/ui/TextAreaField";

function TransformacionSize({
  prefix,
  label,
}: {
  prefix: string;
  label: string;
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h4 className="font-semibold text-sm text-gray-700 mb-3">{label}</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <FormField name={`${prefix}.palletsUNA`} label='Pallets "U" NA' type="number" unit="PLL" />
        <FormField name={`${prefix}.palletsUEX`} label='Pallets "U" EX' type="number" unit="PLL" />
        <FormField name={`${prefix}.palletsO`} label='Pallets "O"' type="number" unit="PLL" />
        <FormField name={`${prefix}.cortados45`} label='Cortados "45"' type="number" unit="UN" />
        <FormField name={`${prefix}.ve`} label='Para "VE"' type="number" unit="UN" />
        <FormField name={`${prefix}.descarte`} label='Para "Descarte"' type="number" unit="UN" />
        <FormField name={`${prefix}.palletsOExport`} label='O Exportación' type="number" unit="PLL" />
      </div>
    </div>
  );
}

export function SeccionTransformacion() {
  return (
    <SectionCard title="Transformación / Reproceso">
      <div className="space-y-4">
        <TransformacionSize prefix="transformacion.x15" label="x 15" />
        <TransformacionSize prefix="transformacion.x175" label="x 17,5" />
        <TransformacionSize prefix="transformacion.x20" label="x 20" />
        <TransformacionSize prefix="transformacion.x25" label="x 25" />
      </div>

      <div className="border-t pt-4 mt-2 space-y-4">
        <TextAreaField name="transformacion.demoras" label="Demoras" />
        <TextAreaField name="transformacion.mantenimiento" label="Mantenimiento" />
        <TextAreaField name="transformacion.limpieza" label="Limpieza" />
        <TextAreaField name="transformacion.comentarios" label="Comentarios" />
      </div>
    </SectionCard>
  );
}
