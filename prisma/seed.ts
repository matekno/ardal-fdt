import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

const SETTINGS = [
  {
    key: "turnos",
    value: ["TURNO MAÑANA", "TURNO TARDE", "TURNO NOCHE"],
    label: "Turnos",
    description: "Lista de turnos disponibles",
  },
  {
    key: "supervisores",
    value: [
      "407 - ZAPATA, FEDERICO",
      "294 - LENCINA GASTON ALEJANDRO",
      "219 - FLORES, CHRISTIAN HERNAN",
      "399 - BERON, ERNESTO ANDRES",
      "385 - AGUIRRE, CLAUDIO FABIAN",
      "320 - SOSA, DANIEL EDUARDO",
      "96 - LARES, ROBERTO GERMAN",
    ],
    label: "Supervisores",
    description: "Lista de supervisores habilitados",
  },
  {
    key: "operarios",
    value: [
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
    ],
    label: "Operarios / Autoelevadoristas",
    description: "Lista de operarios para autoelevadores y otros usos",
  },
  {
    key: "motivos_ausencia",
    value: [
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
    ],
    label: "Motivos de ausencia",
    description: "Códigos de motivos de ausencia del personal",
  },
  {
    key: "puestos",
    value: [
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
    ],
    label: "Puestos de trabajo",
    description: "Lista de puestos disponibles para cambios de puesto",
  },
  {
    key: "objetivo_moldes_colados",
    value: 19,
    label: "Objetivo moldes colados / turno",
    description: "Meta de moldes colados por turno",
  },
  {
    key: "objetivo_rendimiento_hora",
    value: 50,
    label: "Objetivo rendimiento (CM/hora)",
    description: "Meta de rendimiento del molino en CM/hora",
  },
  {
    key: "email_to",
    value: "matiasr@ardal.com.ar",
    label: "Email destinatario FDT",
    description: "Dirección a la que se envían los reportes de fin de turno",
  },
];

async function main() {
  console.log("Seeding settings...");
  for (const s of SETTINGS) {
    await prisma.setting.upsert({
      where: { key: s.key },
      create: s,
      update: { value: s.value, label: s.label, description: s.description },
    });
    console.log(`  ✓ ${s.key}`);
  }
  console.log("Done.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
