import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { apiSuccess, apiError } from "@/lib/api-response";
import { createTaskSchema, taskQuerySchema } from "@/lib/validations/task";

export async function GET(request: NextRequest) {
  try {
    const rawQuery = Object.fromEntries(request.nextUrl.searchParams);
    const parsed = taskQuerySchema.safeParse(rawQuery);
    if (!parsed.success) {
      return apiError(parsed.error);
    }
    const { status, sort, order, search } = parsed.data;

    const where: Prisma.TaskWhereInput = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { [sort]: order } as Prisma.TaskOrderByWithRelationInput,
    });

    return apiSuccess(tasks);
  } catch (err) {
    return apiError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createTaskSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error);
    }

    const task = await prisma.task.create({ data: parsed.data });
    return apiSuccess(task, 201);
  } catch (err) {
    return apiError(err);
  }
}