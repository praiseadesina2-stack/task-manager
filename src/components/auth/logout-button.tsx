"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    setIsPending(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Logged out.");
      router.push("/");
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Button onClick={handleLogout} disabled={isPending}>
      {isPending ? "Logging out..." : "Log out"}
    </Button>
  );
}