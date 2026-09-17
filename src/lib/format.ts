import { format, isPast, isToday } from "date-fns";

export function formatDueDate(dueDate: string | Date | null): {
  label: string;
  overdue: boolean;
} {
  if (!dueDate) return { label: "No due date", overdue: false };
  const date = new Date(dueDate);
  const overdue = isPast(date) && !isToday(date);
  return { label: format(date, "MMM d, yyyy"), overdue };
}