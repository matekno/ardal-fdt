import { PrismaClient } from '../src/generated/prisma/index.js';
const prisma = new PrismaClient();

async function main() {
  const reports = await prisma.report.findMany({
    select: { id: true, fecha: true, turno: true, supervisor: true, userEmail: true, emailSent: true, createdAt: true },
    orderBy: [{ fecha: 'desc' }, { turno: 'asc' }]
  });
  console.log(`=== REPORTS (${reports.length}) ===`);
  reports.forEach(r => console.log(`${r.fecha} | ${r.turno} | ${r.supervisor} | ${r.userEmail} | emailSent=${r.emailSent} | created=${r.createdAt.toISOString().slice(0,10)}`));

  const settings = await prisma.setting.findMany();
  console.log(`\n=== SETTINGS (${settings.length}) ===`);
  settings.forEach(s => console.log(`${s.key}: ${JSON.stringify(s.value).substring(0, 150)}`));
}

main().then(() => prisma.$disconnect());
