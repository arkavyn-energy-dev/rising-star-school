<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

This repo is a MERN monorepo, **not** a Next.js app despite the note above. The root `src/` and
`public/` folders are leftovers from the old Next.js version and are unused. Actual code lives in:

- `Backend/` — Express + MongoDB REST API, runs on port `5000`. Run with `npm run dev` (see `Backend/README.md` for scripts/API).
- `Frontend/` — React + Vite client, dev server on port `5173`. Run with `npm run dev`; lint with `npm run lint` (oxlint). There is no test script in either package.

### Services & startup order (non-obvious)

1. **MongoDB** is installed (v8) but there is **no systemd** in this environment, so `mongod` is not auto-started. Start it manually before the backend, e.g. in a background/tmux session:
   `mongod --dbpath /data/db --bind_ip 127.0.0.1 --port 27017`
2. **Backend `.env`** is required and git-ignored. If `Backend/.env` is missing, create it with `cp Backend/.env.example Backend/.env` — the committed example defaults to local Mongo (`mongodb://127.0.0.1:27017/rising-star-school`) and works out of the box. Cloudinary / Email / Twilio vars are optional and their features are silently skipped when blank.
3. **Seed** the DB once with `npm run seed` (from `Backend/`). It loads school content and creates the admin login `admin@risingstarschool.edu.in` / `ChangeThisPassword123!` (from `SEED_ADMIN_*`). It skips collections that already have data, so it's safe to re-run.
4. `npm run dev` in `Backend/` first kills anything on port 5000 (via `scripts/killPort.js`) then starts nodemon.

The frontend talks to the API via `VITE_API_URL` (defaults to `http://localhost:5000/api`). In dev, backend CORS auto-allows any `http://localhost:<port>` origin.
