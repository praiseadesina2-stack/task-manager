// src/lib/validations/task.ts
import { z } from "zod";

export const TASK_STATUSES = ["TODO", "IN_PROGRESS", "DONE"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

const emptyStringToNull = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? null : value;

const taskFields = {
  title: z
    .string({ error: "Title must be text" })
    .trim()
    .min(1, "Title is required")
    .max(120, "Title must be 120 characters or fewer"),

  description: z.preprocess(
    emptyStringToNull,
    z
      .string()
      .trim()
      .max(2000, "Description must be 2000 characters or fewer")
      .nullable()
  ),

  status: z.enum(TASK_STATUSES, {
    error: `Status must be one of: ${TASK_STATUSES.join(", ")}`,
  }),

  dueDate: z.preprocess(
    emptyStringToNull,
    z.coerce
      .date({ error: "Due date must be a valid date" })
      .nullable()
  ),
};

export const createTaskSchema = z.object({
  ...taskFields,
  description: taskFields.description.optional(),
  status: taskFields.status.default("TODO"),
  dueDate: taskFields.dueDate.optional(),
});

export const updateTaskSchema = z
  .object(taskFields)
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

export const taskQuerySchema = z.object({
  status: z.enum(TASK_STATUSES).optional(),
  sort: z.enum(["createdAt", "dueDate", "title"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().trim().max(120).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;