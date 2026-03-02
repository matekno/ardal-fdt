import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { key } = await params;
  const row = await prisma.setting.findUnique({ where: { key } });
  if (!row) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }
  return Response.json(row);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { key } = await params;

  let body: { value: unknown; label?: string; description?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  if (body.value === undefined) {
    return Response.json({ error: "missing_value" }, { status: 400 });
  }

  const row = await prisma.setting.upsert({
    where: { key },
    create: {
      key,
      value: body.value as Parameters<typeof prisma.setting.create>[0]["data"]["value"],
      label: body.label,
      description: body.description,
    },
    update: {
      value: body.value as Parameters<typeof prisma.setting.update>[0]["data"]["value"],
      ...(body.label !== undefined ? { label: body.label } : {}),
      ...(body.description !== undefined
        ? { description: body.description }
        : {}),
    },
  });

  return Response.json(row);
}
