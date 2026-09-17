import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { updateTaskSchema } from "@/lib/validations/task";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const task = await prisma.task.findUniqueOrThrow({ where: { id } });
    return apiSuccess(task);
  } catch (err) {
    return apiError(err);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateTaskSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error);
    }

    const task = await prisma.task.update({
      where: { id },
      data: parsed.data,
    });
    return apiSuccess(task);
  } catch (err) {
    return apiError(err);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.task.delete({ where: { id } });
    return apiSuccess({ id });
  } catch (err) {
    return apiError(err);
  }
}