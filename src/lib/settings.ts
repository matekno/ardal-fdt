import { prisma } from "./prisma";
import {
  TURNOS,
  SUPERVISORES,
  OPERARIOS,
  MOTIVOS_AUSENCIA,
  PUESTOS,
  OBJETIVO_MOLDES_COLADOS,
  OBJETIVO_RENDIMIENTO_HORA,
} from "./constants";

export type AppSettings = {
  turnos: string[];
  supervisores: string[];
  operarios: string[];
  motivosAusencia: string[];
  puestos: string[];
  objetivoMoldesColados: number;
  objetivoRendimientoHora: number;
  emailTo: string;
};

export const DEFAULT_SETTINGS: AppSettings = {
  turnos: [...TURNOS],
  supervisores: [...SUPERVISORES],
  operarios: [...OPERARIOS],
  motivosAusencia: [...MOTIVOS_AUSENCIA],
  puestos: [...PUESTOS],
  objetivoMoldesColados: OBJETIVO_MOLDES_COLADOS,
  objetivoRendimientoHora: OBJETIVO_RENDIMIENTO_HORA,
  emailTo: process.env.EMAIL_TO ?? "",
};

export async function getAppSettings(): Promise<AppSettings> {
  try {
    const rows = await prisma.setting.findMany();
    const map: Record<string, unknown> = Object.fromEntries(
      rows.map((r) => [r.key, r.value])
    );
    return {
      turnos: Array.isArray(map.turnos)
        ? (map.turnos as string[])
        : DEFAULT_SETTINGS.turnos,
      supervisores: Array.isArray(map.supervisores)
        ? (map.supervisores as string[])
        : DEFAULT_SETTINGS.supervisores,
      operarios: Array.isArray(map.operarios)
        ? (map.operarios as string[])
        : DEFAULT_SETTINGS.operarios,
      motivosAusencia: Array.isArray(map.motivos_ausencia)
        ? (map.motivos_ausencia as string[])
        : DEFAULT_SETTINGS.motivosAusencia,
      puestos: Array.isArray(map.puestos)
        ? (map.puestos as string[])
        : DEFAULT_SETTINGS.puestos,
      objetivoMoldesColados:
        typeof map.objetivo_moldes_colados === "number"
          ? map.objetivo_moldes_colados
          : DEFAULT_SETTINGS.objetivoMoldesColados,
      objetivoRendimientoHora:
        typeof map.objetivo_rendimiento_hora === "number"
          ? map.objetivo_rendimiento_hora
          : DEFAULT_SETTINGS.objetivoRendimientoHora,
      emailTo:
        typeof map.email_to === "string"
          ? map.email_to
          : DEFAULT_SETTINGS.emailTo,
    };
  } catch {
    // DB unavailable — fall back to hardcoded defaults
    return DEFAULT_SETTINGS;
  }
}
