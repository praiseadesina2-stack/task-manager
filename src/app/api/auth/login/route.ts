import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma"; // ⚠️ confirm this path/export — see note at the end
import { loginSchema } from "@/lib/validations/auth";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/session";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed JSON body." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input.", fields: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  const invalidCredentials = () =>
    NextResponse.json({ error: "Invalid email or password." }, { status: 401 });

  if (!user) return invalidCredentials();

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) return invalidCredentials();

  const token = await createSessionToken({ userId: user.id, email: user.email });

  const response = NextResponse.json({ email: user.email }, { status: 200 });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}