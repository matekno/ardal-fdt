/**
 * Script de preparación para producción
 * - Borra todos los reportes de prueba
 * - Actualiza supervisores y operarios en la tabla Setting
 *
 * Uso: node scripts/prepare-prod.mjs
 * Dry run: node scripts/prepare-prod.mjs --dry-run
 */

import { PrismaClient } from '../src/generated/prisma/index.js';

const DRY_RUN = process.argv.includes('--dry-run');
const prisma = new PrismaClient();

const SUPERVISORES = [
  "197 - Zalazar, Néstor",
  "94 - Bella, Eduardo",
  "140 - Akerman, Héctor",
  "372 - Obeid, Yair",
  "126 - Fernandez, Agustín",
  "6 - Silva, Darío",
];

const OPERARIOS = [
  "377 - Oneto, Sergio Emanuel",
  "162 - Benavento, Adrian Federico",
  "344 - Omar, Luis Hernán",
  "498 - Lucero Tolosa, Ruben Dario",
  "650 - Benavento, Darío",
  "399 - Beron, Ernesto Andrés",
  "409 - Pereyra, Enzo Diego",
  "550 - Villani, Daniel Adrián",
  "502 - Zapata, Juan Ignacio",
  "492 - Vera, Juan Gabriel",
  "294 - Lencina, Gastón Alejandro",
  "320 - Sosa, Daniel Eduardo",
  "234 - Machado, Abel Alejandro",
  "489 - Morales, Facundo Leonel",
  "526 - Barrios, Nicolas Alejandro",
  "714 - Torres, Víctor",
  "407 - Zapata, Federico Damián",
  "128 - Zapata, Martin Daniel",
  "555 - Figueras, Rodrigo",
  "65 - Enrique, Juan Carlos",
  "469 - Wagner, Cristian Román",
  "328 - Seghesso, Luis Darío",
  "141 - Velazquez, Leonardo Ramón",
  "643 - Buchardo, Cristian",
  "696 - Páez, Carlos",
  "313 - Juarez, Walter Alberto",
  "593 - Atencio, Brian Franco",
  "504 - Machado, Carlos Angel E",
  "401 - Taborda, Ernesto Rubén",
  "169 - Garcia, Ramón Ariel",
  "694 - Gimenez, Luciano",
  "252 - Beron, Roberto Marcelo",
  "219 - Flores, Christian",
  "429 - Magistrelli, Carlos Javier",
  "707 - Reitú, Axel",
  "453 - Flores, Sabino Andrés",
  "124 - Lencina, Héctor Ramón",
  "321 - Vallejos, Carlos",
  "173 - Enrique, José Luis",
  "137 - Bejariel, Rubén",
  "198 - Medrano, Pedro Alberto",
  "546 - Peralta, Gustavo Andrés",
  "528 - Akerman, Martin Sebastian",
  "386 - Guzman, Ramiro Daniel",
  "220 - Zapata, Víctor Marcelo",
  "524 - Morales, Guillermo Pablo",
  "165 - Brasesco, Mauricio Rodolfo",
  "110 - Ramirez, Abel Gregorio",
  "499 - Coronel, Emmanuel",
  "86 - Capelari, Gastón Roberto",
  "460 - Charpentier, Maximiliano",
  "661 - Poletti, Paulo",
  "712 - Ruiz Moreno, Julian",
  "586 - Beltaco, Matías",
  "304 - Godoy, Cristian Alberto",
  "118 - Brassesco, Javier Evaristo",
  "380 - Benitez, Edgar",
  "362 - Loza, Ariel David",
  "587 - Díaz, Claudio Daniel",
  "466 - Lallana, Alfredo Euclides",
  "385 - Aguirre, Claudio Fabián",
  "710 - Montojo, Leonel",
  "214 - Navoni, Ramón Agustín",
  "494 - Acosta, Franco Marcelo",
  "553 - Alvarez, Joaquín Ignacio",
  "163 - Rueda, Franco Emiliano",
  "554 - Saldaña, Leonel",
  "507 - Alaguibe, Lucas Mauricio",
  "450 - Godoy, Franco David",
  "496 - Tillar Torigino, Aldo Carmelo",
  "655 - Vigliani Santiago",
  "709 - Robledo, Juan Manuel",
  "708 - Héctor Leones",
  "540 - Machado, Augusto",
  "391 - Zapata, Francisco Daniel",
  "205 - Riquelme Santiago",
  "334 - Beron, Raúl Gustavo",
  "311 - Hernandez, Manuel",
];

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN (no se ejecutan cambios) ===' : '=== EJECUTANDO PREPARACIÓN PRODUCCIÓN ===');
  console.log('');

  // 1. Mostrar reportes que se van a borrar
  const reports = await prisma.report.findMany({
    select: { id: true, fecha: true, turno: true, supervisor: true },
    orderBy: [{ fecha: 'desc' }],
  });
  console.log(`1. REPORTES DE PRUEBA: ${reports.length} encontrados`);
  reports.forEach(r => console.log(`   - ${r.fecha} | ${r.turno} | ${r.supervisor}`));

  if (!DRY_RUN && reports.length > 0) {
    const deleted = await prisma.report.deleteMany({});
    console.log(`   >>> Eliminados: ${deleted.count} reportes`);
  }
  console.log('');

  // 2. Actualizar supervisores
  console.log(`2. SUPERVISORES: actualizando a ${SUPERVISORES.length} supervisores`);
  SUPERVISORES.forEach(s => console.log(`   - ${s}`));
  if (!DRY_RUN) {
    await prisma.setting.upsert({
      where: { key: 'supervisores' },
      create: { key: 'supervisores', value: SUPERVISORES, label: 'Supervisores', description: 'Lista de supervisores habilitados' },
      update: { value: SUPERVISORES },
    });
    console.log('   >>> Actualizado');
  }
  console.log('');

  // 3. Actualizar operarios
  console.log(`3. OPERARIOS: actualizando a ${OPERARIOS.length} operarios`);
  if (!DRY_RUN) {
    await prisma.setting.upsert({
      where: { key: 'operarios' },
      create: { key: 'operarios', value: OPERARIOS, label: 'Operarios / Autoelevadoristas', description: 'Lista de operarios para autoelevadores y otros usos' },
      update: { value: OPERARIOS },
    });
    console.log('   >>> Actualizado');
  }
  console.log('');

  // 4. Verificar estado final
  if (!DRY_RUN) {
    const remainingReports = await prisma.report.count();
    const supSetting = await prisma.setting.findUnique({ where: { key: 'supervisores' } });
    const opSetting = await prisma.setting.findUnique({ where: { key: 'operarios' } });
    console.log('=== ESTADO FINAL ===');
    console.log(`Reportes en DB: ${remainingReports}`);
    console.log(`Supervisores en Setting: ${Array.isArray(supSetting?.value) ? supSetting.value.length : '?'}`);
    console.log(`Operarios en Setting: ${Array.isArray(opSetting?.value) ? opSetting.value.length : '?'}`);
  } else {
    console.log('=== DRY RUN COMPLETO - ejecutar sin --dry-run para aplicar cambios ===');
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
