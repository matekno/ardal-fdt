export const TURNOS = [
  "TURNO MAÑANA",
  "TURNO TARDE",
  "TURNO NOCHE",
] as const;

export const SUPERVISORES = [
  "407 - ZAPATA, FEDERICO",
  "294 - LENCINA GASTON ALEJANDRO",
  "219 - FLORES, CHRISTIAN HERNAN",
  "399 - BERON, ERNESTO ANDRES",
  "385 - AGUIRRE, CLAUDIO FABIAN",
  "320 - SOSA, DANIEL EDUARDO",
  "96 - LARES, ROBERTO GERMAN",
] as const;

export const OPERARIOS = [
  "65 - BAIGORRIA, PABLO",
  "86 - TELLO, MARIO DANIEL",
  "96 - LARES, ROBERTO GERMAN",
  "110 - PERALTA, JORGE OSCAR",
  "140 - DIAZ, FRANCO",
  "173 - ARANDA, CRISTIAN",
  "219 - FLORES, CHRISTIAN HERNAN",
  "294 - LENCINA, GASTON ALEJANDRO",
  "320 - SOSA, DANIEL EDUARDO",
  "328 - RAMOS, LEANDRO",
  "385 - AGUIRRE, CLAUDIO FABIAN",
  "399 - BERON, ERNESTO ANDRES",
  "407 - ZAPATA, FEDERICO",
  "492 - RODRIGUEZ, LUCIANO",
  "519 - GUTIERREZ, SERGIO",
  "546 - HERNANDEZ, PABLO",
  "550 - LOPEZ, MARTIN",
  "629 - MORALES, ESTEBAN",
] as const;

export const OBJETIVO_MOLDES_COLADOS = 19;

export const MOTIVOS_AUSENCIA = [
  "AI - AUSENCIA INJUSTIFICADA",
  "ASA - AUSENTE SIN AVISO",
  "AV - ADELANTO DE VACACIONES",
  "CAP - OPERARIO EN CAPACITACIÓN",
  "DC - DEVOLUCIÓN POR CAMBIO DE DÍA",
  "LAL - LICENCIA ACCIDENTE LABORAL",
  "LDS - LICENCIA DONACIÓN DE SANGRE",
  "LE - LICENCIA PARA EXAMEN",
  "LFF - LICENCIA POR FALLECIMIENTO DE FAMILIAR",
  "LM - LICENCIA MEDICA",
  "LMA - LICENCIA POR MATRIMONIO",
  "LME - LICENCIA POR MATERNIDAD ESTADO DE EXEDENCIA",
  "LMM - LICENCIA POR MATERNIDAD",
  "LN - LICENCIA POR NACIMIENTO",
  "PPC - PROCEDIMIENTO PREVENTIVO DE CRISIS",
  "RP - RESERVA DE PUESTO",
  "SD - SUSPENCIÓN DISCIPLINARIA",
  "AUSENTE CON AVISO",
] as const;

export const PUESTOS = [
  "Acondicionamiento",
  "Autoelevador",
  "Caldera",
  "Corte - Auxiliar",
  "Corte - Titular",
  "Curado",
  "Desmantelado",
  "Desmolde - Maquinista",
  "Desmolde - Paletizador",
  "Empaquetador",
  "Jefatura/ Administración",
  "Laboratorio",
  "Limpieza",
  "Maduración - Armador",
  "Maduración - Operario",
  "Maestranza",
  "Mantenimiento",
  "Molino",
  "Pañol",
  "Portería",
  "Rotador",
  "Sala de control",
  "Supervisor",
  "Transformación",
] as const;

export const AGUA_EN_USO = [
  "Condensado",
  "Semisurgente",
  "Condensado/Semisurgente",
  "Semisurgente/Condensado",
] as const;

export const SISTEMA_DOSIFICACION = ["Manual", "Automático"] as const;

export const CALOVENTORES_MODO = ["Automático", "Manual"] as const;

export type TabDef = {
  id: string;
  label: string;
  sectionKey: string;
};

export const TABS: TabDef[] = [
  { id: "encabezado", label: "Encabezado", sectionKey: "encabezado" },
  { id: "general", label: "General", sectionKey: "general" },
  { id: "personal", label: "Personal", sectionKey: "personal" },
  { id: "molino3", label: "Molino 3", sectionKey: "molino3" },
  { id: "stockBarro", label: "Stock Barro", sectionKey: "stockBarro" },
  { id: "salaControl", label: "Sala de Colado", sectionKey: "salaControl" },
  { id: "maduracion", label: "Maduración", sectionKey: "maduracion" },
  { id: "corte", label: "Corte", sectionKey: "corteDesmantelado" },
  { id: "rotador", label: "Rotador", sectionKey: "rotador" },
  { id: "precurado", label: "Precurado", sectionKey: "precuradoAutoclaves" },
  { id: "caldera", label: "Caldera", sectionKey: "caldera" },
  { id: "desmolde", label: "Desmolde", sectionKey: "desmolde" },
  { id: "granallado", label: "Granallado", sectionKey: "granallado" },
  { id: "scrap", label: "Scrap", sectionKey: "scrap" },
  { id: "transformacion", label: "Transformación", sectionKey: "transformacion" },
  { id: "autoelevadores", label: "Autoelevadores", sectionKey: "autoelevadores" },
];
