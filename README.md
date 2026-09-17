# Task Manager

A full-stack task management application built as a practical assessment for a Software Engineering Internship. It supports full CRUD operations—create, list, view, update, delete—backed by a SQLite database, comprehensive server-side validation, and a searchable dashboard.

This project was built and tested end-to-end within a 24–48 hour window. It focuses on clean architecture, pragmatic trade-offs, and frictionless setup for reviewers rather than production-ready feature bloat.

## Tech Stack

| Layer | Choice | Details |
| --- | --- | --- |
| **Framework** | Next.js 16.3.5 | App Router, TypeScript, `src/` directory |
| **Database** | SQLite | File-based, zero-install |
| **ORM** | Prisma 7.10.0 | Custom client output path, `@libsql/client` driver |
| **Validation** | Zod 4.6.5 | Server-side validation on all mutating routes |
| **Styling** | Tailwind CSS 4 | CSS-first config, custom properties on `:root` |
| **UI/Utils** | `lucide-react`, `sonner` | Icons, toast notifications |
| **Class Utils** | `clsx`, `tailwind-merge` | Composed via a `cn()` helper function |

## Getting Started

### 1. Install Dependencies

```bash
npm install

```

### 2. Environment Setup

Create a `.env` file in the project root. No external services, auth providers, or API keys are required.

```env
DATABASE_URL="file:./dev.db"

```

### 3. Database Initialization

Run the migration to create the SQLite file and generate the Prisma client.

```bash
npx prisma migrate dev

```

*Note: This generates the Prisma client into `src/generated/prisma` rather than `node_modules`. You must re-run this if the schema changes.*

### 4. Run the Application

```bash
npm run dev

```

Visit `http://localhost:3000`. The dashboard will start empty; use the "New Task" flow to populate data.

## API Reference

**Base path:** `/api/tasks`

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/tasks` | List tasks. Supports `search`, `status`, `sort`, and `order` queries. |
| `POST` | `/api/tasks` | Create a new task. |
| `GET` | `/api/tasks/[id]` | Fetch a single task by ID. |
| `PATCH` | `/api/tasks/[id]` | Update an existing task. |
| `DELETE` | `/api/tasks/[id]` | Delete a task. |

All routes utilize a centralized error handler returning a consistent JSON shape:

```json
{
  "error": "Validation failed",
  "fields": { "title": "String must contain at least 1 character(s)" }
}

```

* **400**: Malformed JSON or Zod validation failure.
* **404**: Record not found (Prisma code `P2025`).
* **500**: Unhandled server errors.

## Database Schema

```prisma
model Task {
  id          String    @id @default(cuid())
  title       String
  description String?
  status      String    @default("TODO")
  dueDate     DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([status])
  @@index([dueDate])
}

```

## Architectural Decisions & Trade-offs

* **Prisma Driver Adapter (`libSQL`):** Prisma 7's standard SQLite connector requires native C++ binaries. I initially attempted to use `@prisma/adapter-better-sqlite3`, but native build steps failed locally. Switching to the `@libsql/client` adapter bypassed native compilation entirely—a pragmatic fix to avoid fighting the local toolchain.
* **Custom Prisma Client Path:** The generated client lives in `src/generated/prisma` instead of `node_modules/.prisma`. This keeps it colocated with application code for predictable imports, though it requires regenerating the client on a fresh clone.
* **Application-Layer Enums:** SQLite lacks native enum support. Instead of emulating it awkwardly in the database, `status` is stored as a plain string. Data integrity is strictly enforced at the application boundary via Zod and a TypeScript union.
* **Stateless Status Transitions:** Any status can transition to any other status (e.g., `DONE` back to `TODO`). Implementing a strict state machine felt like scope creep for a 48-hour assessment.
* **Server-Only Zod Validation:** To avoid duplicating schemas or restructuring files just to make them client-safe, the frontend form relies entirely on the server's Zod validation. Field errors are caught via the API response and rendered inline.
* **Hand-rolled Modal:** The application only requires a single modal (delete confirmation). A custom, lightweight dialog component with click-outside and Escape-to-close logic was implemented rather than pulling in a heavy headless UI dependency like Radix.
* **Contextual 404 Handling:** API routes return a structured JSON `404` when a Prisma `P2025` error is caught. Server Components (like the detail page) perform a `findUnique` and trigger Next.js's `notFound()` directly.

## Development & Debugging Notes

A few friction points encountered and resolved during development:

* **Silent 404s from Misplaced Routes:** Next.js uses folder-based routing. Accidentally placing a `route.ts` or `page.tsx` inside `src/components/tasks/` instead of `src/app/tasks/` fails silently—Next simply ignores it.
* **Stale Turbopack Cache:** Deleting a route file occasionally caused `tsc --noEmit` to flag errors on files that no longer existed. This was traced to a stale `.next/dev/types/validator.ts` cache, requiring a hard deletion of the `.next` folder to resolve.
* **TypeScript Extension Gotcha:** Creating a React component file as `.ts` instead of `.tsx` causes TypeScript to throw `TS2307: Cannot find module` everywhere the component is imported. This masks the actual issue (a wrong file extension) behind what looks like a broken path.

## Scope & Known Limitations

* **No Pagination:** The task list loads all records at once.
* **No Test Suite:** Manual end-to-end verification was performed using `curl` and browser flows due to time constraints.
* **No Database Seeding:** The database starts empty after migration.
* **Dependency Vulnerabilities:** `npm audit` flags vulnerabilities in transitive dependencies. Given the history of version-specific breakages when force-upgrading Next.js/Prisma environments, I opted not to run `npm audit fix --force` mid-assessment.

## Project Structure

```text
src/
├── app/
│   ├── api/tasks/           # API routes (GET, POST, PATCH, DELETE)
│   ├── tasks/               # UI routes (Dashboard, Create, Detail)
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Tailwind 4 setup
├── components/
│   ├── ui/                  # Reusable primitives (Buttons, Inputs, Dialogs)
│   └── tasks/               # Domain-specific components (Cards, Forms, Filters)
├── lib/
│   ├── utils.ts             # Tailwind class merger
│   └── format.ts            # Date formatting utilities
├── types/
│   └── task.ts              # Shared TypeScript interfaces
└── generated/prisma/        # Custom Prisma client output

```