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

// Número obligatorio (acepta 0, rechaza vacío/NaN)
const reqNum: z.ZodType<number> = z.preprocess(
  (val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const n = Number(val);
    return isNaN(n) ? undefined : n;
  },
  z.number({ error: "Campo obligatorio" })
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

// Nro de torta/molde (compartido por todos los campos "orden")
const ordenItemSchema = z.object({
  valor: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return null;
      const n = Number(val);
      return isNaN(n) ? null : Math.round(n);
    },
    z.number().int().nullable()
  ),
});

const ajustadasDetalleSchema = z.object({
  activo: z.boolean(),
  signo: z.string(),    // "+" | "-" | ""
  cantidad: optNum,
  medida: z.string(),
});

const autoelevadorItemSchema = z.object({
  operador: z.string(),
  desdeHora: z.string(),
  hastaHora: z.string(),
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
  horasMarcha: reqNum.pipe(z.number().max(8)),
  rendimientoHora: reqNum,
  cuerposMoliendaKG: reqNum,
  causaBajoRendimiento: z.string(),
  aguaEnUso: z.string(),
  mantenimiento: z.string(),
  limpieza: z.string(),
});

export const stockBarroSchema = z.object({
  arena: reqNum,
  recupero: reqNum,
  comentarios: z.string(),
  demoras: z.string(),
});

export const salaControlSchema = z.object({
  horaInicio: z.string().min(1, "Campo obligatorio"),
  moldesColados: reqNum,
  dintelColado: z.array(ordenItemSchema).max(2),
  cambioCemento: z.array(ordenItemSchema).max(5),
  cambioCal: z.array(ordenItemSchema).max(5),
  pruebasEnsayos: z.string(),
  demoras: z.string(),
  mantenimiento: z.string(),
  limpieza: z.string(),
  otros: z.string(),
});

export const maduracionSchema = z.object({
  moldesEnSala: reqNum.pipe(z.number().min(0).max(30)),
  caloventoresModo: z.string().min(1, "Campo obligatorio"),
  caloventoresTemp: reqNum.pipe(z.number().min(45).max(60)),
  cambioNylon: z.array(ordenItemSchema).max(5),
  moldePinchado: z.array(ordenItemSchema).max(5),
  moldeFisurado: z.array(ordenItemSchema).max(5),
  demoras: z.string(),
  mantenimiento: z.string(),
  limpieza: z.string(),
  comentarios: z.string(),
});

export const corteDesmanteladoSchema = z.object({
  dintelCortado: z.array(ordenItemSchema).max(5),
  moldeFisurado: z.array(ordenItemSchema).max(5),
  demoras: z.string(),
  mantenimiento: z.string(),
  limpieza: z.string(),
  comentarios: z.string(),
});

export const rotadorSchema = z.object({
  arrastreNylon: z.array(ordenItemSchema).max(5),
  moldeFisurado: z.array(ordenItemSchema).max(5),
});

export const precuradoAutoclavesSchema = z.object({
  moldesPreCurado: reqNum.pipe(z.number().min(0).max(12)),
  moldesATC2: reqNum.pipe(z.number().min(0).max(12)),
  moldesEnVias: optNum,
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
  moldesMaquina: reqNum,
  moldesManual: reqNum,
  dintelDesmoldado: z.array(ordenItemSchema).max(5),
  fallaAspiracion: z.array(ordenItemSchema).max(5),
  fueraMedida: z.array(ordenItemSchema).max(5),
  ajustadas1era: ajustadasDetalleSchema,
  ajustadasReproceso: ajustadasDetalleSchema,
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
  parcialPct: reqNum,
  moldesPendientes: optNum,
});

const transformacionSizeSchema = z.object({
  palletsUNA: optNum,
  palletsUEX: optNum,
  palletsO: optNum,
  cortados45: optNum,
  ve: optNum,
  descarte: optNum,
  palletsOExport: optNum,
});

export const transformacionSchema = z.object({
  x15: transformacionSizeSchema,
  x175: transformacionSizeSchema,
  x20: transformacionSizeSchema,
  x25: transformacionSizeSchema,
  demoras: z.string(),
  mantenimiento: z.string(),
  limpieza: z.string(),
  comentarios: z.string(),
});

export const autoelevadoresSchema = z.object({
  lista: z.array(autoelevadorItemSchema).max(8),
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
export type AjustadasDetalle = z.infer<typeof ajustadasDetalleSchema>;
export type OrdenItem = z.infer<typeof ordenItemSchema>;

// ── Factory ──

export function createEmptyReport(): Report {
  const emptySize = (): TransformacionSize => ({
    palletsUNA: null,
    palletsUEX: null,
    palletsO: null,
    cortados45: null,
    ve: null,
    descarte: null,
    palletsOExport: null,
  });

  const emptyAjustadas = (): AjustadasDetalle => ({
    activo: false,
    signo: "",
    cantidad: null,
    medida: "",
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
      horasExtras: [],
      permisos: [],
      devolucionHoras: { cantidad: null, lista: [] },
      personalNuevo: { cantidad: null, lista: [] },
      vacaciones: "",
      capacitacion: [],
      otrosComentarios: "",
    },
    molino3: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      horasMarcha: null as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rendimientoHora: null as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cuerposMoliendaKG: null as any,
      causaBajoRendimiento: "",
      aguaEnUso: "",
      mantenimiento: "",
      limpieza: "",
    },
    stockBarro: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      arena: null as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recupero: null as any,
      comentarios: "",
      demoras: "",
    },
    salaControl: {
      horaInicio: "",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      moldesColados: null as any,
      dintelColado: [],
      cambioCemento: [],
      cambioCal: [],
      pruebasEnsayos: "",
      demoras: "",
      mantenimiento: "",
      limpieza: "",
      otros: "",
    },
    maduracion: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      moldesEnSala: null as any,
      caloventoresModo: "",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      caloventoresTemp: null as any,
      cambioNylon: [],
      moldePinchado: [],
      moldeFisurado: [],
      demoras: "",
      mantenimiento: "",
      limpieza: "",
      comentarios: "",
    },
    corteDesmantelado: {
      dintelCortado: [],
      moldeFisurado: [],
      demoras: "",
      mantenimiento: "",
      limpieza: "",
      comentarios: "",
    },
    rotador: {
      arrastreNylon: [],
      moldeFisurado: [],
    },
    precuradoAutoclaves: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      moldesPreCurado: null as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      moldesATC2: null as any,
      moldesEnVias: null,
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      moldesMaquina: null as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      moldesManual: null as any,
      dintelDesmoldado: [],
      fallaAspiracion: [],
      fueraMedida: [],
      ajustadas1era: emptyAjustadas(),
      ajustadasReproceso: emptyAjustadas(),
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
    scrap: {
      cerradoPct: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parcialPct: null as any,
      moldesPendientes: null,
    },
    transformacion: {
      x15: emptySize(),
      x175: emptySize(),
      x20: emptySize(),
      x25: emptySize(),
      demoras: "",
      mantenimiento: "",
      limpieza: "",
      comentarios: "",
    },
    autoelevadores: { lista: [] },
    resumenMantenimiento: [],
  };
}

// ── Compilar resumen de mantenimiento ──

export function compilarResumenMantenimiento(
  report: Report
): { area: string; texto: string }[] {
  const areas = [
    { area: "Molino (3)", texto: report.molino3.mantenimiento },
    { area: "Sala de Colado", texto: report.salaControl.mantenimiento },
    { area: "Maduración", texto: report.maduracion.mantenimiento },
    { area: "Corte / Desmantelado", texto: report.corteDesmantelado.mantenimiento },
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
