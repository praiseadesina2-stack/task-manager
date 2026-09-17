import { TaskForm } from "@/components/tasks/task-form";

export default function NewTaskPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-black">New Task</h1>
      <TaskForm mode="create" />
    </main>
  );
}