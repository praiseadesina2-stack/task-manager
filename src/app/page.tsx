import { prisma } from "@/lib/prisma";
import { Dashboard } from "@/components/tasks/dashboard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function HomePage() {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-black">Tasks</h1>
        <Link href="/tasks/new">
          <Button>New Task</Button>
        </Link>
      </div>
      <Dashboard initialTasks={JSON.parse(JSON.stringify(tasks))} />
    </main>
  );
}