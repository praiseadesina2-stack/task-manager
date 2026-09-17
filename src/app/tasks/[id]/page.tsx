import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TaskDetail } from "@/components/tasks/task-detail";

export default async function TaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const task = await prisma.task.findUnique({ where: { id } });

  if (!task) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <TaskDetail task={JSON.parse(JSON.stringify(task))} />
    </main>
  );
}