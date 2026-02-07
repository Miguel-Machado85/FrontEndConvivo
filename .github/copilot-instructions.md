## Preferred model
- Enable/Prefer: Claude Sonnet 4 for all clients when generating code or performing higher-level reasoning about architecture and design decisions.

## Quick summary (big picture)
- Monorepo-like layout with two main parts:
  - Frontend: `FrontEndConvivo/main` — Angular 20 app (MatDash template). Uses lazy-loaded route modules under `src/app/pages`, services under `src/app/services`, and typed models under `src/app/models`.
  - Backend: `BackEndConvivo` — Node + Express API using Sequelize and Postgres. Routes live in `routes/`, logic in `controllers/`, models in `models/` and migrations in `migrations/`.

## Typical dev workflows (concrete commands)
- Frontend (development):
  - cd into the Angular app: `cd FrontEndConvivo/main`
  - install: `npm install`
  - serve: `npm start` (runs `ng serve`, default port 4200)
- Backend (development):
  - cd `BackEndConvivo`
  - install: `npm install`
  - run server: `npm run dev` (starts `nodemon server.js`, default port 3000)
  - run migrations (when needed): `npx sequelize-cli db:migrate` (config reads `config/config.js` which uses `DATABASE_URL` env var)

## Key integration points & examples
- Frontend services call the backend at `http://localhost:3000` by default. Example:
  - `FrontEndConvivo/main/src/app/services/Usuario/Usuario.service.ts` uses `private api_url = 'http://localhost:3000/usuario'` and calls endpoints like `/crearUsuario`, `/verUsuario/:id`, `/verUsuarios`.
  - Services include an `Authorization` header pulled from `localStorage.getItem('AuthToken')` (see `Usuario.service.ts`) — when updating auth behavior, update services accordingly.
- Backend routes exposed:
  - `/usuario` (see `BackEndConvivo/routes/usuarioRoutes.js`)
  - `/auth` (see `BackEndConvivo/routes/authRoutes.js`)
  - `/conjunto` (see `BackEndConvivo/routes/conjuntoRoutes.js`)

## Authentication pattern
- JWT stored in browser `localStorage` under key `AuthToken`. Frontend attaches header `Authorization: Bearer <token>` in several service calls.
- Backend expects standard Bearer JWT (see usage in controllers/middleware and `express-jwt` in `package.json`).

## Database & environment
- `BackEndConvivo/config/config.js` expects `DATABASE_URL` env var and enables SSL by default (dialectOptions.ssl). For local Postgres, set `DATABASE_URL` like `postgres://user:pass@localhost:5432/dbname`.
- Typical `.env` keys to look for / set: `PORT`, `DATABASE_URL`, `JWT_SECRET`, email credentials used by `emailService.js`.

## Project-specific conventions
- Frontend
  - Lazy-loaded modules declared in `src/app/app.routes.ts` (e.g., `authentication`, `conjunto`, `perfil`, `menu`). When adding pages, follow the same lazy-route pattern and folder layout under `src/app/pages`.
  - Services group by domain under `src/app/services/<Domain>` (e.g., `Usuario/Usuario.service.ts`). Update `api_url` there when backend base URL or path changes.
  - Models (interfaces) live in `src/app/models` and mirror backend shape (e.g., `usuario.model.ts`, `usuarioRequest.model.ts`).
- Backend
  - Sequelize models in `models/` and migrations in `migrations/`. Use `sequelize-cli` for migrations. `config/config.js` centralizes DB settings.
  - Controllers implement business logic, routes wire controllers into `server.js` (search `app.use('/usuario', ...)`).

## Debugging tips & examples
- To exercise the backend endpoint used by the frontend (PowerShell/curl example):
  - curl with bearer token (PowerShell):
    curl -i -H "Authorization: Bearer <TOKEN>" http://localhost:3000/usuario/verUsuario/<id>
- Check `BackEndConvivo/server.js` for request logging (morgan) and middleware order — useful when adding new middleware.

## When you change an API route
- Update the corresponding frontend service in `FrontEndConvivo/main/src/app/services/*` to match the new path and ensure the Authorization behavior stays consistent.

## Files to inspect for examples
- Frontend: `FrontEndConvivo/main/src/app/services/Usuario/Usuario.service.ts`, `FrontEndConvivo/main/src/app/models/*`, `FrontEndConvivo/main/src/app/app.routes.ts`.
- Backend: `BackEndConvivo/server.js`, `BackEndConvivo/routes/*.js`, `BackEndConvivo/controllers/*.js`, `BackEndConvivo/models/*.js`, `BackEndConvivo/migrations/*`.

## Minimal goals for PRs involving backend/frontend changes
- Include an updated example request in the modified service (frontend) and an updated route entry in `server.js` (backend).
- If DB schema changes, add a migration under `migrations/` and include the `npx sequelize-cli db:migrate` command in the PR description for reviewers.

## Ask for feedback
- If any sections are unclear or you want additional examples (e.g., a quick recipe for adding a new lazy-loaded page or an API auth middleware example), tell me which area and I'll expand.
