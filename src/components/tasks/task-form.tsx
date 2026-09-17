"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { Task, TaskStatus } from "@/types/task";

interface TaskFormProps {
  mode: "create" | "edit";
  initialTask?: Task;
}

interface FormFieldErrors {
  title?: string[];
  description?: string[];
  status?: string[];
  dueDate?: string[];
}

export function TaskForm({ mode, initialTask }: TaskFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTask?.title ?? "");
  const [description, setDescription] = useState(initialTask?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(initialTask?.status ?? "TODO");
  const [dueDate, setDueDate] = useState(
    initialTask?.dueDate ? initialTask.dueDate.slice(0, 10) : ""
  );
  const [errors, setErrors] = useState<FormFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    const payload = {
      title,
      description: description || null,
      status,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    };

    try {
      const url = mode === "create" ? "/api/tasks" : `/api/tasks/${initialTask!.id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json();

      if (!res.ok) {
        if (body.error?.fields) {
          setErrors(body.error.fields);
          toast.error("Please fix the highlighted fields");
        } else {
          toast.error(body.error?.message ?? "Something went wrong");
        }
        return;
      }

      toast.success(mode === "create" ? "Task created" : "Task updated");
      router.push(mode === "create" ? "/" : `/tasks/${initialTask!.id}`);
      router.refresh();
    } catch {
      toast.error("Network error — is the server running?");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-black">
          Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={!!errors.title}
          disabled={submitting}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600">{errors.title[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-black">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={submitting}
          className="w-full rounded-md border border-[var(--color-border)] px-3 py-2 text-sm text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-600">{errors.description[0]}</p>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label htmlFor="status" className="mb-1 block text-sm font-medium text-black">
            Status
          </label>
          <Select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            disabled={submitting}
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </Select>
        </div>

        <div className="flex-1">
          <label htmlFor="dueDate" className="mb-1 block text-sm font-medium text-black">
            Due date
          </label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            error={!!errors.dueDate}
            disabled={submitting}
          />
          {errors.dueDate && (
            <p className="mt-1 text-xs text-red-600">{errors.dueDate[0]}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          disabled={submitting}
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : mode === "create" ? "Create task" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}