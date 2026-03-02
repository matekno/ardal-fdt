import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const rows = await prisma.setting.findMany({
    orderBy: { key: "asc" },
  });

  return Response.json(rows);
}
