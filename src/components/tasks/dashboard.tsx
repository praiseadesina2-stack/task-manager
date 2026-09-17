"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TaskList } from "@/components/tasks/task-list";
import { FilterBar, type TaskFilters } from "@/components/tasks/filter-bar";
import type { Task } from "@/types/task";

export function Dashboard({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({
    status: "",
    sort: "createdAt",
    order: "desc",
    search: "",
  });
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    // Skip the refetch on mount — initialTasks from the server already
    // reflects the default filter state, so refetching immediately would
    // be a redundant round-trip on first paint.
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.status) params.set("status", filters.status);
        if (filters.search) params.set("search", filters.search);
        params.set("sort", filters.sort);
        params.set("order", filters.order);

        const res = await fetch(`/api/tasks?${params.toString()}`, {
          signal: controller.signal,
        });
        const body = await res.json();

        if (!res.ok) {
          throw new Error(body.error?.message ?? "Failed to load tasks");
        }

        setTasks(body.data);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          toast.error(err.message);
        }
      } finally {
        setLoading(false);
      }
    }, 300); // debounce, mainly for the search input

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [filters, isFirstRender]);

  return (
    <div className="space-y-4">
      <FilterBar filters={filters} onChange={setFilters} />
      <TaskList tasks={tasks} loading={loading} />
    </div>
  );
}