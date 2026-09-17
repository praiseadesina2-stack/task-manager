import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDueDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

export function TaskCard({ task }: { task: Task }) {
  const { label, overdue } = formatDueDate(task.dueDate);

  return (
    <Link
      href={`/tasks/${task.id}`}
      className="block rounded-md border border-[var(--color-border)] bg-white p-4 transition-colors hover:border-[var(--color-accent)]"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-medium text-black">{task.title}</h3>
        <Badge status={task.status} />
      </div>
      {task.description && (
        <p className="mt-1 line-clamp-2 text-sm text-[var(--color-muted)]">
          {task.description}
        </p>
      )}
      <p
        className={cn(
          "mt-3 text-xs",
          overdue ? "font-medium text-red-600" : "text-[var(--color-muted)]"
        )}
      >
        {overdue ? "Overdue: " : "Due: "}
        {label}
      </p>
    </Link>
  );
}