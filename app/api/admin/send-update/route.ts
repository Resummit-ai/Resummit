import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/server/prisma";
import nodemailer from "nodemailer";
import { z } from "zod";

const schema = z.object({
  subject: z.string().min(1).max(200),
  html:    z.string().min(1).max(100_000),
  // Optional: send only to specific userIds, defaults to ALL users
  userIds: z.array(z.string()).optional(),
});

/**
 * POST /api/admin/send-update
 * Sends an update email to all users (or a subset).
 * Protected: only you (the admin) can call this.
 */
export async function POST(req: Request) {
  const session = await auth();

  // Only you can call this — hardcoded admin guard
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "adelmuhammed786@gmail.com";
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);
  const smtpSecure = process.env.SMTP_SECURE === "true" || smtpPort === 465;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    return NextResponse.json({ error: "SMTP credentials (SMTP_USER and SMTP_PASS) are not configured" }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const { subject, html, userIds } = parsed.data;

  // Fetch target users
  const users = await prisma.user.findMany({
    where: {
      email: { not: null },
      ...(userIds ? { id: { in: userIds } } : {}),
    },
    select: { id: true, name: true, email: true },
  });

  const emails = users
    .filter((u: { email: string | null }) => u.email)
    .map((u: { email: string | null }) => u.email as string);

  if (emails.length === 0) {
    return NextResponse.json({ error: "No users with emails found" }, { status: 400 });
  }

  const results: { email: string; success: boolean; error?: string }[] = [];
  const fromEmail = process.env.SMTP_FROM_EMAIL || smtpUser;

  for (const email of emails) {
    try {
      await transporter.sendMail({
        from: `Resummit <${fromEmail}>`,
        to: email,
        subject,
        html,
        headers: {
          "List-Unsubscribe": `<mailto:unsubscribe@resummit.dev?subject=Unsubscribe>`,
        },
      });
      results.push({ email, success: true });
    } catch (err: any) {
      results.push({ email, success: false, error: err.message });
    }
  }

  const sent   = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  return NextResponse.json({ sent, failed, results });
}

/**
 * GET /api/admin/send-update
 * Returns the list of all user emails (admin only).
 */
export async function GET(req: Request) {
  const session = await auth();
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "adelmuhammed786@gmail.com";
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    where: { email: { not: null } },
    select: { id: true, name: true, email: true, createdAt: true, githubUsername: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ users, total: users.length });
}
