// src/lib/validations/task.ts
import { z } from "zod";

/**
 * Single source of truth for allowed statuses.
 * SQLite has no native enum type, so this constant is what
 * actually enforces status validity in our system.
 */
export const TASK_STATUSES = ["TODO", "IN_PROGRESS", "DONE"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

/**
 * HTML inputs submit "" for empty fields, never null/undefined.
 * We normalise "" to null so optional fields clear correctly.
 */
const emptyStringToNull = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? null : value;

/**
 * Field definitions WITHOUT defaults, shared by create and update.
 * Defaults are applied only on create — see the note below.
 */
const taskFields = {
  title: z
    .string({ message: "Title must be text" })
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
    message: `Status must be one of: ${TASK_STATUSES.join(", ")}`,
  }),

  dueDate: z.preprocess(
    emptyStringToNull,
    z.coerce
      .date({ message: "Due date must be a valid date" })
      .nullable()
  ),
};

/** POST /api/tasks */
export const createTaskSchema = z.object({
  ...taskFields,
  description: taskFields.description.optional(),
  status: z.enum(TASK_STATUSES).default("TODO"),
  dueDate: taskFields.dueDate.optional(),
});

/** PATCH /api/tasks/[id] — every field optional, but body can't be empty */
export const updateTaskSchema = z
  .object(taskFields)
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

/** GET /api/tasks?status=...&sort=... */
export const taskQuerySchema = z.object({
  status: z.enum(TASK_STATUSES).optional(),
  sort: z.enum(["createdAt", "dueDate", "title"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().trim().max(120).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;