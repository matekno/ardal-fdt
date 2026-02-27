"use client";

import { SectionCard } from "@/components/ui/SectionCard";
import { FormField } from "@/components/ui/FormField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { SelectField } from "@/components/ui/SelectField";
import { DynamicList } from "@/components/ui/DynamicList";
import { SUPERVISORES, MOTIVOS_AUSENCIA, PUESTOS } from "@/lib/constants";

export function SeccionPersonal() {
  return (
    <SectionCard title="Personal" color="red">
      {/* Accidentes / Incidentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextAreaField name="personal.accidentes" label="Accidentes" rows={2} />
        <TextAreaField name="personal.incidentes" label="Incidentes" rows={2} />
      </div>

      {/* ── Ausentes ── */}
      <div className="border-t pt-4 mt-2">
        <FormField
          name="personal.cantidadAusentes"
          label="Cantidad ausentes"
          type="number"
        />
        <div className="mt-3">
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
                  options={SUPERVISORES}
                  placeholder="Seleccionar..."
                />
                <SelectField
                  name={`personal.ausentes.${index}.motivo`}
                  label="Motivo"
                  options={MOTIVOS_AUSENCIA}
                  placeholder="Seleccionar motivo..."
                />
              </div>
            )}
          />
        </div>
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
                options={SUPERVISORES}
                placeholder="Seleccionar..."
              />
              <SelectField
                name={`personal.cambiosPuesto.${index}.puesto`}
                label="Puesto que cubre"
                options={PUESTOS}
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
              <FormField
                name={`personal.horasExtras.${index}.personal`}
                label="Personal"
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
          newItem={() => ({ personalYMotivo: "" })}
          renderItem={(index) => (
            <FormField
              name={`personal.permisos.${index}.personalYMotivo`}
              label="Personal / Motivo"
            />
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
                <FormField
                  name={`personal.devolucionHoras.lista.${index}.personal`}
                  label="Personal"
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
            newItem={() => ({ personalYPuesto: "" })}
            renderItem={(index) => (
              <FormField
                name={`personal.personalNuevo.lista.${index}.personalYPuesto`}
                label="Personal / Puesto"
              />
            )}
          />
        </div>
      </div>

      {/* ── Vacaciones ── */}
      <div className="border-t pt-4 mt-2">
        <TextAreaField name="personal.vacaciones" label="Vacaciones" rows={2} />
      </div>

      {/* ── Capacitación ── */}
      <div className="border-t pt-4 mt-2">
        <DynamicList
          name="personal.capacitacion"
          maxItems={3}
          label="Capacitación"
          newItem={() => ({ personalYCapacitacion: "" })}
          renderItem={(index) => (
            <FormField
              name={`personal.capacitacion.${index}.personalYCapacitacion`}
              label="Personal / Capacitación"
            />
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
    </SectionCard>
  );
}
