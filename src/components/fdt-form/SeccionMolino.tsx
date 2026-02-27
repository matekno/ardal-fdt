"use client";

import { useWatch } from "react-hook-form";
import { SectionCard } from "@/components/ui/SectionCard";
import { FormField } from "@/components/ui/FormField";
import { SelectField } from "@/components/ui/SelectField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { AGUA_EN_USO, SISTEMA_DOSIFICACION } from "@/lib/constants";

interface SeccionMolinoProps {
  molinoNumber: 2 | 3;
}

export function SeccionMolino({ molinoNumber }: SeccionMolinoProps) {
  const prefix = molinoNumber === 3 ? "molino3" : "molino2";
  const unValue = useWatch({ name: `${prefix}.cuerposMoliendaUN` }) as number | null;
  const kgCalculado = unValue != null ? unValue * 30 : null;

  return (
    <SectionCard title={`Molino ${molinoNumber}`}>
      {molinoNumber === 3 && (
        <SelectField
          name="molino3.sistemaDosificacion"
          label="Sistema dosificación A/Y"
          options={SISTEMA_DOSIFICACION}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          name={`${prefix}.horasMarcha`}
          label="Horas de marcha"
          type="number"
          unit="HS"
        />
        <FormField
          name={`${prefix}.rendimientoHora`}
          label="Rendimiento / hora"
          type="number"
          unit="CM"
        />
        <FormField
          name={`${prefix}.cuerposMoliendaUN`}
          label="Cuerpos molienda (baldes x 30kg)"
          type="number"
          unit="UN"
        />
        {/* KG auto-calculado: no se guarda, solo se muestra */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-[0.08em]">
            Cuerpos molienda
          </span>
          <div className="flex items-center gap-2">
            <span className="flex-1 px-2 py-[0.35rem] rounded-md bg-zinc-100 text-sm font-mono text-zinc-400 border border-zinc-200">
              {kgCalculado != null ? kgCalculado : "—"}
            </span>
            <span className="text-[11px] text-zinc-400 font-mono shrink-0 min-w-[32px]">
              KG
            </span>
          </div>
        </div>
      </div>

      <SelectField
        name={`${prefix}.aguaEnUso`}
        label="Agua en uso"
        options={AGUA_EN_USO}
      />
      <TextAreaField name={`${prefix}.mantenimiento`} label="Mantenimiento" />
      <TextAreaField name={`${prefix}.limpieza`} label="Limpieza" />
    </SectionCard>
  );
}
