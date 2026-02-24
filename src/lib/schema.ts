import { z } from "zod";

// ── Helpers ──

// Acepta number, string vacío, NaN, null, undefined → number | null
const numNullable = z.number().nullable();
const optNum: z.ZodType<number | null> = z.preprocess(
  (val) => {
    if (val === "" || val === null || val === undefined) return null;
    const n = Number(val);
    return isNaN(n) ? null : n;
  },
  numNullable
);

// ── Sub-schemas para listas dinámicas ──

const ausenteSchema = z.object({
  nombre: z.string(),
  motivo: z.string(),
});

const cambioPuestoSchema = z.object({
  personal: z.string(),
  puesto: z.string(),
});

const cambioHorarioSchema = z.object({
  ausente: z.string(),
  presente: z.string(),
  comentario: z.string(),
});

const horaExtraSchema = z.object({
  personal: z.string(),
  desdeHora: z.string(),
  hastaHora: z.string(),
});

const permisoSchema = z.object({
  personalYMotivo: z.string(),
});

const devolucionHoraSchema = z.object({
  personal: z.string(),
  desdeHora: z.string(),
  hastaHora: z.string(),
});

const personalNuevoSchema = z.object({
  personalYPuesto: z.string(),
});

const capacitacionSchema = z.object({
  personalYCapacitacion: z.string(),
});

const columnaEncimadoSchema = z.object({
  numero: z.string(),
  defecto: z.string(),
});

// ── Sección schemas ──

export const encabezadoSchema = z.object({
  fecha: z.string().min(1, "Fecha es obligatoria"),
  turno: z.string().min(1, "Turno es obligatorio"),
  supervisor: z.string().min(1, "Supervisor es obligatorio"),
});

export const generalSchema = z.object({
  explicacionNoCumplimiento: z.string(),
  otrosComentarios: z.string(),
});

export const personalSchema = z.object({
  accidentes: z.string(),
  incidentes: z.string(),
  cantidadAusentes: optNum,
  ausentes: z.array(ausenteSchema).max(8),
  comentarioAusentes: z.string(),
  cambiosPuesto: z.array(cambioPuestoSchema).max(8),
  cambiosHorario: z.array(cambioHorarioSchema).max(5),
  horasExtras: z.array(horaExtraSchema).max(5),
  permisos: z.array(permisoSchema).max(3),
  devolucionHoras: z.object({
    cantidad: optNum,
    lista: z.array(devolucionHoraSchema).max(3),
  }),
  personalNuevo: z.object({
    cantidad: optNum,
    lista: z.array(personalNuevoSchema).max(5),
  }),
  vacaciones: z.string(),
  capacitacion: z.array(capacitacionSchema).max(3),
  otrosComentarios: z.string(),
});

export const molino3Schema = z.object({
  sistemaDosificacion: z.string(),
  horasMarcha: optNum,
  rendimientoHora: optNum,
  cuerposMoliendaUN: optNum,
  cuerposMoliendaKG: optNum,
  aguaEnUso: z.string(),
  mantenimiento: z.string(),
  limpieza: z.string(),
});

export const molino2Schema = z.object({
  horasMarcha: optNum,
  rendimientoHora: optNum,
  cuerposMoliendaUN: optNum,
  cuerposMoliendaKG: optNum,
  aguaEnUso: z.string(),
  mantenimiento: z.string(),
  limpieza: z.string(),
});

export const stockBarroSchema = z.object({
  arena: optNum,
  recupero: optNum,
  comentarios: z.string(),
  demoras: z.string(),
});

export const salaControlSchema = z.object({
  horaInicio: z.string(),
  moldesColados: z.string(),
  dintelColado: z.string(),
  cambioCemento: z.string(),
  cambioCal: z.string(),
  pruebasEnsayos: z.string(),
  demoras: z.string(),
  mantenimiento: z.string(),
  limpieza: z.string(),
  otros: z.string(),
});

export const maduracionSchema = z.object({
  moldesEnSala: optNum,
  caloventoresModo: z.string(),
  caloventoresTemp: optNum,
  cambioNylon: z.string(),
  moldePinchado: z.string(),
  moldeFisurado: z.string(),
  demoras: z.string(),
  mantenimiento: z.string(),
  limpieza: z.string(),
  comentarios: z.string(),
});

export const corteDesmanteladoSchema = z.object({
  dintelCortado: z.string(),
  moldeFisurado: z.string(),
  demoras: z.string(),
  mantenimiento: z.string(),
  limpieza: z.string(),
  comentarios: z.string(),
});

export const rotadorSchema = z.object({
  arrastreNylon: z.string(),
  moldeFisurado: z.string(),
  columnasEncimado: z.array(columnaEncimadoSchema).max(4),
  demoras: z.string(),
  mantenimiento: z.string(),
  limpieza: z.string(),
  comentarios: z.string(),
});

export const precuradoAutoclavesSchema = z.object({
  moldesPreCurado: optNum,
  moldesATC2: optNum,
  demoras: z.string(),
  mantenimiento: z.string(),
  limpieza: z.string(),
  comentarios: z.string(),
});

export const calderaSchema = z.object({
  demoras: z.string(),
  mantenimiento: z.string(),
  limpieza: z.string(),
  comentarios: z.string(),
});

export const desmoldeSchema = z.object({
  moldesMaquina: optNum,
  moldesManual: optNum,
  dintelDesmoldado: z.string(),
  fallaAspiracion: z.string(),
  fueraMedida: z.string(),
  ajustadas1era: z.string(),
  ajustadasReproceso: z.string(),
  demoras: z.string(),
  mantenimiento: z.string(),
  limpieza: z.string(),
  comentarios: z.string(),
});

export const granalladoSchema = z.object({
  planchasGranalladas: optNum,
  demoras: z.string(),
  mantenimiento: z.string(),
  limpieza: z.string(),
  comentarios: z.string(),
});

export const scrapSchema = z.object({
  cerradoPct: optNum,
  parcialPct: optNum,
  moldesPendientes: optNum,
});

const transformacionSizeSchema = z.object({
  palletsUNA: optNum,
  palletsUEX: optNum,
  palletsO: optNum,
  cortados45: optNum,
  ve: optNum,
  descarte: optNum,
  descartePct: optNum,
});

export const transformacionSchema = z.object({
  x15: transformacionSizeSchema,
  x175: transformacionSizeSchema,
  x20: transformacionSizeSchema,
  demoras: z.string(),
  mantenimiento: z.string(),
  limpieza: z.string(),
  comentarios: z.string(),
});

export const autoelevadoresSchema = z.object({
  comentarios: z.string(),
});

const resumenMantenimientoItemSchema = z.object({
  area: z.string(),
  texto: z.string(),
});

// ── Reporte completo ──

export const reportSchema = z.object({
  encabezado: encabezadoSchema,
  general: generalSchema,
  personal: personalSchema,
  molino3: molino3Schema,
  molino2: molino2Schema,
  stockBarro: stockBarroSchema,
  salaControl: salaControlSchema,
  maduracion: maduracionSchema,
  corteDesmantelado: corteDesmanteladoSchema,
  rotador: rotadorSchema,
  precuradoAutoclaves: precuradoAutoclavesSchema,
  caldera: calderaSchema,
  desmolde: desmoldeSchema,
  granallado: granalladoSchema,
  scrap: scrapSchema,
  transformacion: transformacionSchema,
  autoelevadores: autoelevadoresSchema,
  resumenMantenimiento: z.array(resumenMantenimientoItemSchema),
});

// ── Tipos derivados ──

export type Report = z.infer<typeof reportSchema>;
export type Encabezado = z.infer<typeof encabezadoSchema>;
export type Personal = z.infer<typeof personalSchema>;
export type TransformacionSize = z.infer<typeof transformacionSizeSchema>;

// ── Factory ──

export function createEmptyReport(): Report {
  const emptySize = (): TransformacionSize => ({
    palletsUNA: null,
    palletsUEX: null,
    palletsO: null,
    cortados45: null,
    ve: null,
    descarte: null,
    descartePct: null,
  });

  return {
    encabezado: { fecha: "", turno: "", supervisor: "" },
    general: { explicacionNoCumplimiento: "", otrosComentarios: "" },
    personal: {
      accidentes: "",
      incidentes: "",
      cantidadAusentes: null,
      ausentes: [],
      comentarioAusentes: "",
      cambiosPuesto: [],
      cambiosHorario: [],
      horasExtras: [],
      permisos: [],
      devolucionHoras: { cantidad: null, lista: [] },
      personalNuevo: { cantidad: null, lista: [] },
      vacaciones: "",
      capacitacion: [],
      otrosComentarios: "",
    },
    molino3: {
      sistemaDosificacion: "",
      horasMarcha: null,
      rendimientoHora: null,
      cuerposMoliendaUN: null,
      cuerposMoliendaKG: null,
      aguaEnUso: "",
      mantenimiento: "",
      limpieza: "",
    },
    molino2: {
      horasMarcha: null,
      rendimientoHora: null,
      cuerposMoliendaUN: null,
      cuerposMoliendaKG: null,
      aguaEnUso: "",
      mantenimiento: "",
      limpieza: "",
    },
    stockBarro: { arena: null, recupero: null, comentarios: "", demoras: "" },
    salaControl: {
      horaInicio: "",
      moldesColados: "",
      dintelColado: "",
      cambioCemento: "",
      cambioCal: "",
      pruebasEnsayos: "",
      demoras: "",
      mantenimiento: "",
      limpieza: "",
      otros: "",
    },
    maduracion: {
      moldesEnSala: null,
      caloventoresModo: "",
      caloventoresTemp: null,
      cambioNylon: "",
      moldePinchado: "",
      moldeFisurado: "",
      demoras: "",
      mantenimiento: "",
      limpieza: "",
      comentarios: "",
    },
    corteDesmantelado: {
      dintelCortado: "",
      moldeFisurado: "",
      demoras: "",
      mantenimiento: "",
      limpieza: "",
      comentarios: "",
    },
    rotador: {
      arrastreNylon: "",
      moldeFisurado: "",
      columnasEncimado: [],
      demoras: "",
      mantenimiento: "",
      limpieza: "",
      comentarios: "",
    },
    precuradoAutoclaves: {
      moldesPreCurado: null,
      moldesATC2: null,
      demoras: "",
      mantenimiento: "",
      limpieza: "",
      comentarios: "",
    },
    caldera: {
      demoras: "",
      mantenimiento: "",
      limpieza: "",
      comentarios: "",
    },
    desmolde: {
      moldesMaquina: null,
      moldesManual: null,
      dintelDesmoldado: "",
      fallaAspiracion: "",
      fueraMedida: "",
      ajustadas1era: "",
      ajustadasReproceso: "",
      demoras: "",
      mantenimiento: "",
      limpieza: "",
      comentarios: "",
    },
    granallado: {
      planchasGranalladas: null,
      demoras: "",
      mantenimiento: "",
      limpieza: "",
      comentarios: "",
    },
    scrap: { cerradoPct: null, parcialPct: null, moldesPendientes: null },
    transformacion: {
      x15: emptySize(),
      x175: emptySize(),
      x20: emptySize(),
      demoras: "",
      mantenimiento: "",
      limpieza: "",
      comentarios: "",
    },
    autoelevadores: { comentarios: "" },
    resumenMantenimiento: [],
  };
}

// ── Compilar resumen de mantenimiento ──

export function compilarResumenMantenimiento(
  report: Report
): { area: string; texto: string }[] {
  const areas = [
    { area: "Molino (3)", texto: report.molino3.mantenimiento },
    { area: "Molino (2)", texto: report.molino2.mantenimiento },
    { area: "Sala de Control", texto: report.salaControl.mantenimiento },
    { area: "Maduración", texto: report.maduracion.mantenimiento },
    { area: "Corte / Desmantelado", texto: report.corteDesmantelado.mantenimiento },
    { area: "Rotador", texto: report.rotador.mantenimiento },
    { area: "Precurado / Autoclaves", texto: report.precuradoAutoclaves.mantenimiento },
    { area: "Caldera", texto: report.caldera.mantenimiento },
    { area: "Desmolde", texto: report.desmolde.mantenimiento },
    { area: "Granallado", texto: report.granallado.mantenimiento },
    { area: "Transformación", texto: report.transformacion.mantenimiento },
  ];

  return areas
    .filter((a) => a.texto && a.texto.trim())
    .map((a) => ({ area: a.area, texto: a.texto.trim() }));
}
