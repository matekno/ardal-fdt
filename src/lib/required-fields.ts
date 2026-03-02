export type RequiredField = {
  path: string[];
  label: string;
  /** Si existe, el campo solo es obligatorio cuando la condición devuelve true */
  condition?: (formData: Record<string, unknown>) => boolean;
};

export type RequiredSection = {
  sectionId: string; // matches TABS id
  label: string;
  fields: RequiredField[];
};

/**
 * Construye el mapa de campos obligatorios.
 * El umbral de rendimiento viene de settings para que sea consistente con la UI.
 */
export function getRequiredFieldsMap(
  objetivoRendimientoHora: number = 50
): RequiredSection[] {
  return [
    {
      sectionId: "encabezado",
      label: "Encabezado",
      fields: [
        { path: ["encabezado", "fecha"], label: "Fecha" },
        { path: ["encabezado", "turno"], label: "Turno" },
        { path: ["encabezado", "supervisor"], label: "Supervisor" },
      ],
    },
    {
      sectionId: "molino3",
      label: "Molino 3",
      fields: [
        { path: ["molino3", "horasMarcha"], label: "Horas en marcha" },
        { path: ["molino3", "rendimientoHora"], label: "Rendimiento/hora" },
        {
          path: ["molino3", "cuerposMoliendaKG"],
          label: "Cuerpos molienda (KG)",
        },
        {
          path: ["molino3", "causaBajoRendimiento"],
          label: "Causa bajo rendimiento",
          condition: (formData) => {
            const val = getNestedValue(formData, ["molino3", "rendimientoHora"]);
            const num =
              val !== "" && val !== null && val !== undefined
                ? Number(val)
                : NaN;
            return !isNaN(num) && num > 0 && num < objetivoRendimientoHora;
          },
        },
      ],
    },
    {
      sectionId: "stockBarro",
      label: "Stock Barro",
      fields: [
        { path: ["stockBarro", "arena"], label: "Arena" },
        { path: ["stockBarro", "recupero"], label: "Recupero" },
      ],
    },
    {
      sectionId: "salaControl",
      label: "Sala de Colado",
      fields: [
        { path: ["salaControl", "moldesColados"], label: "Moldes colados" },
        { path: ["salaControl", "horaInicio"], label: "Hora de inicio" },
      ],
    },
    {
      sectionId: "maduracion",
      label: "Maduración",
      fields: [
        { path: ["maduracion", "moldesEnSala"], label: "Moldes en sala" },
        {
          path: ["maduracion", "caloventoresTemp"],
          label: "Temperatura caloventores",
        },
      ],
    },
    {
      sectionId: "precurado",
      label: "Precurado",
      fields: [
        {
          path: ["precuradoAutoclaves", "moldesPreCurado"],
          label: "Moldes pre-curado",
        },
        { path: ["precuradoAutoclaves", "moldesATC2"], label: "Moldes ATC2" },
      ],
    },
    {
      sectionId: "desmolde",
      label: "Desmolde",
      fields: [
        { path: ["desmolde", "moldesMaquina"], label: "Moldes máquina" },
        { path: ["desmolde", "moldesManual"], label: "Moldes manual" },
      ],
    },
    {
      sectionId: "scrap",
      label: "Scrap",
      fields: [{ path: ["scrap", "parcialPct"], label: "Scrap parcial (%)" }],
    },
  ];
}

/** Retrocompatibilidad — usa umbral 50 por defecto */
export const REQUIRED_FIELDS_MAP = getRequiredFieldsMap(50);

/**
 * Reads a nested value from an object using a path array.
 * e.g. getNestedValue(obj, ["molino3", "horasMarcha"])
 */
export function getNestedValue(
  obj: Record<string, unknown>,
  path: string[]
): unknown {
  let current: unknown = obj;
  for (const key of path) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

/**
 * Returns true if the field value is considered "filled".
 */
export function isFieldFilled(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (typeof value === "number") return !isNaN(value);
  if (typeof value === "boolean") return true;
  return false;
}
