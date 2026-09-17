Task Manager

A full-stack task management application built for a Software Engineering Internship practical assessment. It supports full CRUD on tasks — create, list, view, update, delete — backed by a real database, with server-side validation and a searchable/filterable dashboard.

This was built and tested end-to-end within the assessment's 24–48 hour window. It is not intended to be production-ready — see Assumptions & Known Limitations for what was deliberately left out or simplified.

Tech Stack
Layer	Choice
Framework	Next.js 16.3.5 — App Router, TypeScript, src/ directory, @/* import alias
Database	SQLite (file-based)
ORM	Prisma 7.10.0, with a custom client output path at src/generated/prisma
DB driver	@libsql/client 0.8.1 via @prisma/adapter-libsql
Validation	Zod 4.6.5 (server-side, on every mutating route)
Styling	Tailwind CSS 4 — CSS-first config, palette defined as CSS custom properties on :root
Icons	lucide-react
Toasts	sonner
Dates	date-fns
Class utils	clsx + tailwind-merge, composed via a cn() helper
Getting Started
Prerequisites
Node.js (LTS)
npm
1. Install dependencies
bash
npm install
2. Environment variables

Create a .env file in the project root:

env
DATABASE_URL="file:./dev.db"

No other environment variables are required — there's no external service, auth provider, or API key in this project.

3. Run the database migration and generate the Prisma client
bash
npx prisma migrate dev

This applies prisma/schema.prisma, creates dev.db in the project root, and generates the Prisma client to src/generated/prisma — a custom output location rather than the default node_modules/.prisma. See Technical Decisions for why. This step must be re-run any time the schema changes.

4. Start the dev server
bash
npm run dev

Visit http://localhost:3000.

Note on database contents: no seed script was built (see Assumptions). On a fresh migrate dev, the dashboard will start empty — use the "New Task" flow to add data.

Available Scripts
Command	Purpose
npm run dev	Start the Next.js dev server
npm run build	Production build
npm run start	Start the production build
npx prisma migrate dev	Apply pending migrations, regenerate the Prisma client
npx prisma studio	Browse/edit the SQLite database in a GUI
API

Base path: /api/tasks

Method	Route	Description
GET	/api/tasks	List tasks. Supports search, status, sort, and order query params.
POST	/api/tasks	Create a task.
GET	/api/tasks/[id]	Fetch a single task.
PATCH	/api/tasks/[id]	Update a task.
DELETE	/api/tasks/[id]	Delete a task.

All routes funnel errors through a centralized handler and return a consistent JSON shape:

json
{ "error": "message", "fields": { "title": "..." } }
400 — malformed JSON body or Zod validation failure (fields present for field-level errors)
404 — record not found (Prisma.PrismaClientKnownRequestError with code P2025)
500 — unexpected/unhandled errors

This was manually verified end-to-end with curl.exe, including the malformed-JSON path and the not-found path, not just the happy path.

Task Model
prisma
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

status is a plain string, constrained to TODO | IN_PROGRESS | DONE only at the application layer (Zod + a TypeScript union), not at the database layer. This is a deliberate trade-off — see below.

Technical Decisions

1. Prisma 7 with a driver adapter, not the default SQLite connector. Prisma 7's SQLite support goes through a driver adapter (@prisma/adapter-libsql + @libsql/client) rather than the classic bundled driver. I initially tried @prisma/adapter-better-sqlite3, but it requires a native build step that failed on this machine (no C++ toolchain, and GitHub Releases access was blocked for the prebuilt binary fallback). Switching to the libSQL adapter avoided native compilation entirely and was the pragmatic fix rather than fighting the local toolchain.

2. Custom Prisma client output path (src/generated/prisma). Kept the generated client inside src/ (instead of the node_modules/.prisma default) so it's colocated with the rest of the app code and its import path is predictable. The trade-off is that the generated folder needs to be excluded from source control and regenerated on every fresh clone (npx prisma migrate dev or npx prisma generate handles this).

3. status is enforced at the application layer only, not the database layer. The schema stores status as a plain String, not a native/emulated enum. TypeScript's TaskStatus union and Zod validation on every write are the only things preventing an invalid value from being persisted — a direct database edit could still insert something outside TODO / IN_PROGRESS / DONE. For a 24–48 hour assessment, I judged the added schema complexity of an enforced enum not worth it versus app-level validation. I'd revisit this for a longer-lived project.

4. No restrictions on status transitions. Any status can move to any other status through the edit form (e.g. DONE back to TODO is allowed). This was a deliberate scope decision made up front, not an oversight — a full transition state machine felt like scope creep for this assessment.

5. Client-side form submission does not re-run Zod validation before hitting the API. The create/edit form relies entirely on the server's existing Zod validation and renders error.fields from the API response inline on failure. I considered validating client-side first, but sharing one Zod schema between a server-only module and a Client Component would have meant either duplicating it or restructuring where it lives to be safely client-importable — not worth the time given the user-facing result (inline field errors) is identical either way.

6. Hand-rolled Dialog/Modal component, not a headless-UI library. The whole app has exactly one modal use case (delete confirmation), so a small hand-rolled component (click-outside + Escape-to-close) was simpler and lighter than pulling in a dependency like Radix. I'd make the opposite call if the app needed more than one modal.

7. Edit mode on the task detail page is a client-side toggle, not a separate /tasks/[id]/edit route. Avoids a second server-side fetch of the same task and naturally resets on navigation away. The trade-off is that edit mode isn't bookmarkable or shareable via URL — judged unnecessary for this app's scope.

8. "Not found" is handled two different ways on purpose. The API route detects a missing record via Prisma.PrismaClientKnownRequestError (code P2025) and returns a JSON 404 through the centralized error handler. The task detail page, being a Server Component, has no JSON envelope to return through — it does a findUnique and calls Next's notFound() directly. Same underlying problem, two legitimately different mechanisms because the two contexts (API route vs. rendered page) have different constraints.

Notable Debugging (worth knowing for the walkthrough)

A few issues cost real time and are worth being able to explain rather than gloss over:

.ts vs .tsx with JSX inside. A component file was created as .ts instead of .tsx. TypeScript doesn't fail loudly on the file itself — instead, every file that imports it reports TS2307: Cannot find module, which looks exactly like a missing-file or bad-path error. The actual fix was a one-character extension rename; the investigation initially went down the wrong path chasing a "missing file" that wasn't missing.
src/app/ vs src/components/ name collisions. Both trees contain a folder named tasks, which made it easy to paste a file into the wrong tree. When a route file lands in src/components/ by mistake, Next doesn't error at all — the route is simply never mapped, and the page 404s silently with no compile error. This happened twice in the same session for two different pages, and neither failure mode was obvious from the symptom alone.
Stale Next.js/Turbopack route-type cache. After deleting a misplaced page.tsx, tsc --noEmit kept reporting an error against a file that no longer existed, because Next's generated .next/dev/types/validator.ts cache wasn't invalidated by the delete alone. A full stop-the-dev-server-then-delete-.next was needed to clear it.
Native driver adapter fallback. Covered above under decision #1 — the switch from better-sqlite3 to the libSQL adapter was itself a debugging outcome, not a starting choice.
Assumptions & Known Limitations
No pagination. Out of scope for the assessment window; the task list loads everything at once.
No database-level enum enforcement on status — see decision #3 above.
No status-transition state machine — see decision #4 above.
Client-side form does not pre-validate before hitting the API — see decision #5 above.
No seed script. The dev database reflects whatever manual create/edit/delete testing left behind; run your own creates after migrate dev to populate it.
npm audit currently reports 4 high-severity vulnerabilities introduced by transitive dependencies. I deferred npm audit fix --force rather than run it mid-project, given this stack's history of version-specific breakage from forced upgrades on Prisma/Next majors. This should be reviewed manually post-submission, not blindly force-fixed.
Scratch files generated during manual curl.exe testing (e.g. body.json, patch-body.json, bad-body.json) are excluded via .gitignore rather than committed.
Not production-ready by design, per the assessment brief — no auth, no rate limiting, no automated test suite (all manual verification via curl.exe and real dev-server logs).
Project Structure
src/
  app/
    api/
      tasks/
        route.ts          # GET (list), POST (create)
        [id]/route.ts      # GET, PATCH, DELETE (single task)
    tasks/
      new/page.tsx         # create form
      [id]/page.tsx        # detail view + inline edit
    page.tsx                # dashboard
    layout.tsx              # root layout, mounts <Toaster />
    globals.css              # Tailwind 4 CSS-first setup, theme tokens
  components/
    ui/                      # button, input, select, badge, dialog, empty-state, skeleton
    tasks/                   # task-card, task-list, filter-bar, dashboard, task-form, task-detail
  lib/
    utils.ts                 # cn() helper
    format.ts                 # due-date formatting
  types/
    task.ts
  generated/
    prisma/                  # generated client — not committed, regenerate with `prisma migrate dev`
prisma/
  schema.prisma
  migrations/
Testing

No automated test suite was written given the time budget. All CRUD paths — including error paths (malformed JSON, validation failures, not-found) — were manually verified with curl.exe and cross-checked against real dev-server logs, and the full UI flow (create → list → detail → edit → delete) was walked through manually end to end.