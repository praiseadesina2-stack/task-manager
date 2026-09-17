"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export interface TaskFilters {
  status: string;
  sort: string;
  order: string;
  search: string;
}

export function FilterBar({
  filters,
  onChange,
}: {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative min-w-[200px] flex-1">
        <Search
          size={16}
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
        />
        <Input
          placeholder="Search tasks..."
          className="pl-8"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </div>

      <Select
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
        className="w-auto"
      >
        <option value="">All statuses</option>
        <option value="TODO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
      </Select>

      <Select
        value={filters.sort}
        onChange={(e) => onChange({ ...filters, sort: e.target.value })}
        className="w-auto"
      >
        <option value="createdAt">Sort: Created</option>
        <option value="dueDate">Sort: Due date</option>
        <option value="title">Sort: Title</option>
      </Select>

      <Select
        value={filters.order}
        onChange={(e) => onChange({ ...filters, order: e.target.value })}
        className="w-auto"
      >
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </Select>
    </div>
  );
}