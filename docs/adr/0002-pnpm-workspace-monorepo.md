# pnpm workspace monorepo

The project will use a pnpm workspace monorepo with separate `backend` and `frontend` packages coordinated from the repository root. Each service keeps its own package scripts, environment files, and deployment root so Render can build the backend from `backend/` and Vercel can build the frontend from `frontend/`, while root scripts only orchestrate common development commands.
