"use client";

import { createContext, useContext } from "react";
import type { AppSettings } from "@/lib/settings";
import {
  TURNOS,
  SUPERVISORES,
  OPERARIOS,
  MOTIVOS_AUSENCIA,
  PUESTOS,
  OBJETIVO_MOLDES_COLADOS,
  OBJETIVO_RENDIMIENTO_HORA,
} from "@/lib/constants";

const defaultSettings: AppSettings = {
  turnos: [...TURNOS],
  supervisores: [...SUPERVISORES],
  operarios: [...OPERARIOS],
  motivosAusencia: [...MOTIVOS_AUSENCIA],
  puestos: [...PUESTOS],
  objetivoMoldesColados: OBJETIVO_MOLDES_COLADOS,
  objetivoRendimientoHora: OBJETIVO_RENDIMIENTO_HORA,
  emailTo: "",
};

export const SettingsContext = createContext<AppSettings>(defaultSettings);

export function SettingsProvider({
  settings,
  children,
}: {
  settings: AppSettings;
  children: React.ReactNode;
}) {
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): AppSettings {
  return useContext(SettingsContext);
}
