import { cn } from "@/lib/utils";

type BadgeStatus = "TODO" | "IN_PROGRESS" | "DONE";

const statusStyles: Record<BadgeStatus, string> = {
  TODO: "bg-gray-100 text-gray-700 border-gray-300",
  IN_PROGRESS: "bg-blue-50 text-[var(--color-accent)] border-blue-200",
  DONE: "bg-green-50 text-green-700 border-green-200",
};

const statusLabels: Record<BadgeStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export function Badge({ status }: { status: BadgeStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status]
      )}
    >
      {statusLabels[status]}
    </span>
  );
}