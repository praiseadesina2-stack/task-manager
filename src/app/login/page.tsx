"use client";

import { useState, FormEvent } from "react";
import {
  Zap,
  Search,
  BarChart3,
  ShieldCheck,
  RotateCcw,
  RefreshCw,
  CheckCircle2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Full CRUD",
    description: "Create, read, update and delete tasks.",
  },
  {
    icon: Search,
    title: "Search & Filter",
    description: "Find what you need, instantly.",
  },
  {
    icon: BarChart3,
    title: "Real-time Stats",
    description: "Track your progress at a glance.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
    description: "Your data, always protected.",
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
  e.preventDefault();
  setError(null);
  setSubmitting(true);

  await new Promise((resolve) => setTimeout(resolve, 300));

  if (email === "user@gmail.com" && password === "user123") {
    document.cookie = "session=demo; path=/; max-age=604800";
    window.location.href = "/dashboard";
    return;
  }

  setError("Invalid email or password.");
  setSubmitting(false);
}

  return (
    <div className="flex min-h-screen w-full">
      {/* Left panel — brand / hero */}
      <div className="relative hidden w-full max-w-xl flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-12 py-14 text-white lg:flex">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-indigo-400/20 blur-2xl" />

        {/* logo */}
        <div className="relative flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <span className="text-lg font-bold">N</span>
          </div>
          <span className="text-lg font-semibold">TaskManager</span>
        </div>

        {/* headline + mockup */}
        <div className="relative flex flex-1 flex-col justify-center gap-8 py-10">
          <div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight">
              Plan. Track. Achieve.
              <br />
              <span className="text-blue-200">Without the Overthinking.</span>
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-blue-100/90">
              Create, track, and manage your tasks in one simple dashboard —
              built for the Software Engineering internship practical
              assessment.
            </p>
          </div>

          <div className="flex items-start gap-6">
            {/* terminal-style task card */}
            <div className="w-full max-w-sm rounded-xl border border-white/10 bg-black/25 p-5 font-mono text-sm backdrop-blur-sm">
              <p className="text-blue-200/50 line-through">Create task</p>
              <p className="mt-2 flex items-center gap-2 text-blue-200">
                <RotateCcw size={14} />
                Canceled...
              </p>
              <p className="mt-2 flex items-center gap-2 text-blue-200">
                <RefreshCw size={14} />
                Rewritten...
              </p>
              <p className="mt-2 text-white">
                Manage tasks
                <span className="ml-0.5 inline-block h-4 w-px animate-pulse bg-white align-middle" />
              </p>
            </div>

            {/* stacked card illustration */}
            <div className="relative hidden h-28 w-24 shrink-0 xl:block">
              <div className="absolute inset-x-2 top-0 h-16 rounded-lg bg-white/10" />
              <div className="absolute inset-x-1 top-6 h-16 rounded-lg bg-white/15" />
              <div className="absolute inset-x-0 top-12 flex h-16 items-center gap-2 rounded-lg bg-white/25 px-3">
                <CheckCircle2 size={16} className="text-white" />
                <div className="h-1.5 flex-1 rounded-full bg-white/50" />
              </div>
            </div>
          </div>
        </div>

        {/* feature grid */}
        <div className="relative grid grid-cols-2 gap-x-6 gap-y-8">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                <Icon size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-blue-100/80">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — auth form */}
      <div className="flex w-full flex-1 items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-black">
            Welcome Back <span aria-hidden>👋</span>
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted,#6b7280)]">
            Sign in to continue to your account
          </p>

          <button
            type="button"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-md border border-gray-200 bg-white py-2.5 text-sm font-medium text-black transition-colors hover:bg-gray-50"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-black"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@gmail.com"
                  className="w-full rounded-md border border-gray-200 py-2.5 pl-9 pr-3 text-sm text-black placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-black"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-gray-200 py-2.5 pl-9 pr-9 text-sm text-black placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Logging in..." : "Log In"}
              {!submitting && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            Demo account —{" "}
            <span className="font-medium text-gray-600">
              user@gmail.com / user123
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4c-7.4 0-13.8 4.2-17.7 10.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.4C29.6 35.5 26.9 36.5 24 36.5c-5.3 0-9.7-3.4-11.3-8.1l-6.6 5.1C9.9 39.6 16.4 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.6 5.4C40.9 36.8 44 31.1 44 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  );
}