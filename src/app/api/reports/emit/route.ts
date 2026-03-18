import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAppSettings } from "@/lib/settings";
import { createReportSchema, compilarResumenMantenimiento } from "@/lib/schema";
import { extractMetrics } from "@/lib/report-metrics";
import { generateEmailHTML, generateEmailSubject } from "@/lib/email-generator";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const settings = await getAppSettings();
  const dynamicSchema = createReportSchema(settings);
  const parsed = dynamicSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "validation_error", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  const data = parsed.data;
  const { fecha, turno } = data.encabezado;

  // Check if already emitted
  const existing = await prisma.report.findUnique({
    where: { fecha_turno: { fecha, turno } },
    select: { id: true, emailSent: true },
  });

  if (existing?.emailSent) {
    return Response.json({ error: "ya_emitido" }, { status: 409 });
  }

  // Compile maintenance summary
  data.resumenMantenimiento = compilarResumenMantenimiento(data);

  // Upsert to DB
  let reportId: string;
  try {
    const metrics = extractMetrics(data, session.user.email);
    const report = await prisma.report.upsert({
      where: { fecha_turno: { fecha, turno } },
      create: metrics,
      update: { ...metrics, updatedAt: new Date() },
      select: { id: true },
    });
    reportId = report.id;
  } catch {
    return Response.json({ error: "db_error" }, { status: 500 });
  }

  // Generate and send email
  const html = generateEmailHTML(data, settings);
  const subject = generateEmailSubject(data);
  const emailTo = settings.emailTo;
  if (!emailTo) {
    return Response.json({ error: "email_to_not_configured" }, { status: 500 });
  }

  if (process.env.NODE_ENV === "development") {
    console.log("[emit] Test mode: email skipped");
    console.log("[emit] Subject:", subject);
    console.log("[emit] To:", emailTo);

    return Response.json({
      id: reportId,
      testMode: true,
      message: "Email bloqueado en modo testeo",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
      to: emailTo,
      subject,
      html,
    });
  } catch (err) {
    console.error("[emit] SMTP error:", err);
    return Response.json({ error: "smtp_error" }, { status: 500 });
  }

  // Mark as sent
  const emailSentAt = new Date();
  try {
    await prisma.report.update({
      where: { id: reportId },
      data: { emailSent: true, emailSentAt },
    });
  } catch (err) {
    // Email was sent but DB flag failed — log but return success
    // so the supervisor doesn't retry and send a duplicate email
    console.error("[emit] Failed to mark emailSent:", err);
  }

  return Response.json({
    id: reportId,
    emailSentAt: emailSentAt.toISOString(),
  });
}
