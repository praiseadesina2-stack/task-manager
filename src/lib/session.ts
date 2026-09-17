import { SignJWT, jwtVerify } from "jose";

const secret = process.env.AUTH_SECRET;
if (!secret) {
  throw new Error("AUTH_SECRET is not set. Add it to your .env file.");
}
const key = new TextEncoder().encode(secret);

export const SESSION_COOKIE = "session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days
export const SESSION_MAX_AGE = SESSION_DURATION_SECONDS;

export interface SessionPayload {
  userId: string;
  email: string;
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(key);
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key);
    if (typeof payload.userId !== "string" || typeof payload.email !== "string") {
      return null;
    }
    return { userId: payload.userId, email: payload.email };
  } catch {
    return null;
  }
}