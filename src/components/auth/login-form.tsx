"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setError(null);
  setIsPending(true);

  if (email === "user@gmail.com" && password === "user123") {
    document.cookie = "session=demo; path=/; max-age=604800";
    toast.success("Logged in.");
    router.push("/dashboard");
    router.refresh();
  } else {
    setError("Invalid email or password.");
  }

  setIsPending(false);
}
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">Password</label>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Logging in..." : "Log In"}
      </Button>
      <p className="text-sm text-center opacity-70">
        Demo account — <strong>user@gmail.com</strong> / <strong>user123</strong>
      </p>
    </form>
  );
}