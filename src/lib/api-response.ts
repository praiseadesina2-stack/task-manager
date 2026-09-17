import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "@/generated/prisma/client";

type ApiSuccess<T> = {
  data: T;
};

type ApiErrorBody = {
  error: {
    message: string;
    fields?: Record<string, string[]>;
  };
};

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json<ApiSuccess<T>>({ data }, { status });
}

export function apiError(err: unknown): NextResponse<ApiErrorBody> {
  // Malformed JSON body (e.g. empty body, invalid syntax) -> 400
  // Assumption: any SyntaxError reaching this handler comes from a failed
  // request.json() call — that's the only place this app parses raw JSON.
  if (err instanceof SyntaxError) {
    return NextResponse.json(
      { error: { message: "Malformed JSON body" } },
      { status: 400 }
    );
  }

  // Zod validation failure -> 400, with field-level messages
  if (err instanceof ZodError) {
    const fields: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const key = issue.path.length ? issue.path.join(".") : "_root";
      (fields[key] ??= []).push(issue.message);
    }
    return NextResponse.json(
      { error: { message: "Validation failed", fields } },
      { status: 400 }
    );
  }

  // Prisma: record not found (update/delete on a missing id) -> 404
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
    return NextResponse.json(
      { error: { message: "Resource not found" } },
      { status: 404 }
    );
  }

  // Anything else is unexpected: log the real error server-side only,
  // never leak internals (stack traces, SQL, etc.) to the client
  console.error("Unhandled API error:", err);
  return NextResponse.json(
    { error: { message: "Internal server error" } },
    { status: 500 }
  );
}