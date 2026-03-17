"use client";

import { useWatch } from "react-hook-form";
import { SectionCard } from "@/components/ui/SectionCard";
import { FormField } from "@/components/ui/FormField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { SelectField } from "@/components/ui/SelectField";
import { DynamicList } from "@/components/ui/DynamicList";
import { useSettings } from "@/contexts/SettingsContext";

export function SeccionPersonal() {
  const { operarios, motivosAusencia, puestos } = useSettings();
  const ausentes = useWatch({ name: "personal.ausentes" }) as unknown[];
  const cantidadAusentes = Array.isArray(ausentes) ? ausentes.length : 0;

  return (
    <SectionCard title="Personal" color="red">
      {/* Accidentes / Incidentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextAreaField name="personal.accidentes" label="Accidentes" rows={2} />
        <TextAreaField name="personal.incidentes" label="Incidentes" rows={2} />
      </div>

      {/* ── Ausentes ── */}
      <div className="border-t pt-4 mt-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.08em]">
            Ausentes
          </span>
          {cantidadAusentes > 0 && (
            <span className="text-[11px] font-mono tabular-nums text-zinc-400">
              <span className="text-zinc-700 font-semibold">{cantidadAusentes}</span>{" "}
              {cantidadAusentes === 1 ? "ausente" : "ausentes"}
            </span>
          )}
        </div>
        <DynamicList
          name="personal.ausentes"
          maxItems={8}
          label="Ausente"
          newItem={() => ({ nombre: "", motivo: "" })}
          renderItem={(index) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <SelectField
                name={`personal.ausentes.${index}.nombre`}
                label="Personal"
                options={operarios}
                placeholder="Seleccionar..."
              />
              <SelectField
                name={`personal.ausentes.${index}.motivo`}
                label="Motivo"
                options={motivosAusencia}
                placeholder="Seleccionar motivo..."
              />
            </div>
          )}
        />
        <div className="mt-3">
          <TextAreaField
            name="personal.comentarioAusentes"
            label="Comentario ausentes"
            rows={2}
          />
        </div>
      </div>

      {/* ── Cambios de puesto ── */}
      <div className="border-t pt-4 mt-2">
        <DynamicList
          name="personal.cambiosPuesto"
          maxItems={8}
          label="Cambio de puesto"
          newItem={() => ({ personal: "", puesto: "" })}
          renderItem={(index) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <SelectField
                name={`personal.cambiosPuesto.${index}.personal`}
                label="Personal"
                options={operarios}
                placeholder="Seleccionar..."
              />
              <SelectField
                name={`personal.cambiosPuesto.${index}.puesto`}
                label="Puesto que cubre"
                options={puestos}
                placeholder="Seleccionar puesto..."
              />
            </div>
          )}
        />
      </div>

      {/* ── Banco de Horas ── */}
      <div className="border-t pt-4 mt-2">
        <DynamicList
          name="personal.horasExtras"
          maxItems={5}
          label="Banco de Horas"
          newItem={() => ({ personal: "", desdeHora: "", hastaHora: "" })}
          renderItem={(index) => (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <SelectField
                name={`personal.horasExtras.${index}.personal`}
                label="Personal"
                options={operarios}
                placeholder="Seleccionar..."
              />
              <FormField
                name={`personal.horasExtras.${index}.desdeHora`}
                label="Desde hora"
              />
              <FormField
                name={`personal.horasExtras.${index}.hastaHora`}
                label="Hasta hora"
              />
            </div>
          )}
        />
      </div>

      {/* ── Permisos ── */}
      <div className="border-t pt-4 mt-2">
        <DynamicList
          name="personal.permisos"
          maxItems={3}
          label="Permiso"
          newItem={() => ({ personal: "", motivo: "" })}
          renderItem={(index) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <SelectField
                name={`personal.permisos.${index}.personal`}
                label="Personal"
                options={operarios}
                placeholder="Seleccionar..."
              />
              <FormField
                name={`personal.permisos.${index}.motivo`}
                label="Motivo"
              />
            </div>
          )}
        />
      </div>

      {/* ── Devolución de horas ── */}
      <div className="border-t pt-4 mt-2">
        <FormField
          name="personal.devolucionHoras.cantidad"
          label="Devolución de horas — Cantidad"
          type="number"
        />
        <div className="mt-3">
          <DynamicList
            name="personal.devolucionHoras.lista"
            maxItems={3}
            label="Devolución"
            newItem={() => ({ personal: "", desdeHora: "", hastaHora: "" })}
            renderItem={(index) => (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <SelectField
                  name={`personal.devolucionHoras.lista.${index}.personal`}
                  label="Personal"
                  options={operarios}
                  placeholder="Seleccionar..."
                />
                <FormField
                  name={`personal.devolucionHoras.lista.${index}.desdeHora`}
                  label="Desde hora"
                />
                <FormField
                  name={`personal.devolucionHoras.lista.${index}.hastaHora`}
                  label="Hasta hora"
                />
              </div>
            )}
          />
        </div>
      </div>

      {/* ── Personal nuevo ── */}
      <div className="border-t pt-4 mt-2">
        <FormField
          name="personal.personalNuevo.cantidad"
          label="Personal nuevo (<30 días) — Cantidad"
          type="number"
        />
        <div className="mt-3">
          <DynamicList
            name="personal.personalNuevo.lista"
            maxItems={5}
            label="Personal nuevo"
            newItem={() => ({ personal: "", puesto: "" })}
            renderItem={(index) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <SelectField
                  name={`personal.personalNuevo.lista.${index}.personal`}
                  label="Personal"
                  options={operarios}
                  placeholder="Seleccionar..."
                />
                <SelectField
                  name={`personal.personalNuevo.lista.${index}.puesto`}
                  label="Puesto"
                  options={puestos}
                  placeholder="Seleccionar puesto..."
                />
              </div>
            )}
          />
        </div>
      </div>

      {/* ── Vacaciones ── */}
      <div className="border-t pt-4 mt-2">
        <DynamicList
          name="personal.vacaciones"
          maxItems={8}
          label="Vacaciones"
          newItem={() => ({ personal: "" })}
          renderItem={(index) => (
            <SelectField
              name={`personal.vacaciones.${index}.personal`}
              label="Personal"
              options={operarios}
              placeholder="Seleccionar..."
            />
          )}
        />
      </div>

      {/* ── Capacitación ── */}
      <div className="border-t pt-4 mt-2">
        <DynamicList
          name="personal.capacitacion"
          maxItems={3}
          label="Capacitación"
          newItem={() => ({ personal: "", capacitacion: "" })}
          renderItem={(index) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <SelectField
                name={`personal.capacitacion.${index}.personal`}
                label="Personal"
                options={operarios}
                placeholder="Seleccionar..."
              />
              <FormField
                name={`personal.capacitacion.${index}.capacitacion`}
                label="Capacitación"
              />
            </div>
          )}
        />
      </div>

      {/* ── Otros comentarios ── */}
      <div className="border-t pt-4 mt-2">
        <TextAreaField
          name="personal.otrosComentarios"
          label="Otros comentarios"
        />
      </div>

      {/* ── Novedades operativas ── */}
      <div className="border-t pt-4 mt-2 space-y-3">
        <TextAreaField name="personal.demoras" label="Demoras" />
        <TextAreaField name="personal.mantenimiento" label="Mantenimiento" />
        <TextAreaField name="personal.limpieza" label="Limpieza" />
        <TextAreaField name="personal.comentarios" label="Comentarios" />
      </div>
    </SectionCard>
  );
}
