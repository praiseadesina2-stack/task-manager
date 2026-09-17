import { ClipboardList } from "lucide-react";

export function EmptyState({ message = "No tasks yet." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-[var(--color-border)] py-16 text-center">
      <ClipboardList size={32} className="text-[var(--color-muted)]" />
      <p className="text-sm text-[var(--color-muted)]">{message}</p>
    </div>
  );
}