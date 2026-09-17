"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { TaskForm } from "@/components/tasks/task-form";
import { formatDueDate } from "@/lib/format";
import type { Task } from "@/types/task";

export function TaskDetail({ task }: { task: Task }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { label, overdue } = formatDueDate(task.dueDate);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
      const body = await res.json();

      if (!res.ok) {
        throw new Error(body.error?.message ?? "Failed to delete task");
      }

      toast.success("Task deleted");
      router.push("/");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
      setDeleting(false);
      setConfirmOpen(false);
    }
  }

  if (editing) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-semibold text-black">Edit Task</h1>
        <TaskForm mode="edit" initialTask={task} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <h1 className="text-2xl font-semibold text-black">{task.title}</h1>
        <Badge status={task.status} />
      </div>

      {task.description && (
        <p className="mb-4 whitespace-pre-wrap text-sm text-black">
          {task.description}
        </p>
      )}

      <p className={overdue ? "mb-6 text-sm font-medium text-red-600" : "mb-6 text-sm text-[var(--color-muted)]"}>
        {overdue ? "Overdue: " : "Due: "}
        {label}
      </p>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => setEditing(true)}>
          Edit
        </Button>
        <Button variant="danger" onClick={() => setConfirmOpen(true)}>
          Delete
        </Button>
      </div>

      <Dialog
        open={confirmOpen}
        onClose={() => !deleting && setConfirmOpen(false)}
        title="Delete this task?"
      >
        <p className="mb-4 text-sm text-[var(--color-muted)]">
          This can&apos;t be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            disabled={deleting}
            onClick={() => setConfirmOpen(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" disabled={deleting} onClick={handleDelete}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}