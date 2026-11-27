# The KK Factor: Online News Portal

Design and Development of an Online News Portal with Live Radio, Music Player, and Live News Streaming.

BN304 Industry Based Project 2, Group G1_Mel. Client, Product Owner and Supervisor: Dr Osamah A. Mahdi.

## Team

| Member | Role |
| --- | --- |
| Nur Siamul Hasan | Team Lead / Scrum Master |
| Daksh | Frontend & UI/UX Lead |
| Gagan Shrestha | Backend & API Lead |
| Miraj Adhikari | Media & Streaming Lead |
| Navdeep Arora | Data, CMS & QA Lead |
| Anas Delowar | Floating Role, extra hand for all members |

## Technology stack

- Client: React (Vite)
- API: Node.js with Express
- Database: MongoDB Atlas (Docker Compose MongoDB for local development)
- Audio: HTML5 Audio API
- Hosting (staging): Azure Static Web Apps (client), Azure App Service (API), Azure Blob Storage
- CI/CD: GitHub Actions

## Repository structure

```
client/     React (Vite) front end
server/     Express API
docs/       Test plan, diagrams and other project documents
.github/    Pull request template, code owners and workflows
```

## Local setup

### Prerequisites

- Node.js 22 LTS (`.nvmrc` is provided; run `nvm use` if you use nvm)
- Docker Desktop (for the local MongoDB)
- Git

### First run

```bash
git clone https://github.com/ed1thub/the-kk-factor.git
cd the-kk-factor
npm install                          # installs client and server (npm workspaces)
cp server/.env.example server/.env   # Windows PowerShell: copy server\.env.example server\.env
npm run db:up                        # starts MongoDB in Docker on localhost:27017
npm run dev                          # starts the API and the client together
```

- Client: http://localhost:5173
- API health check: http://localhost:4000/api/health (also reachable through the client at http://localhost:5173/api/health)

The home page shows the API and database status. "Database: connected" means everything is wired up.

### Useful scripts (run from the repository root)

| Script | What it does |
| --- | --- |
| `npm run dev` | Runs the API (port 4000) and client (port 5173) with auto-reload |
| `npm run db:up` / `npm run db:down` | Starts or stops the local MongoDB container |
| `npm test` | Runs the API tests (Jest and Supertest) |
| `npm run lint` | Lints the client |
| `npm run build` | Builds the client for production |

### Environment variables

Each app has a `.env.example` listing every variable it needs. Copy it to `.env` (server) or `.env.local` (client) and fill in values. Real `.env` files are ignored by Git and must never be committed.

### API layout

```
server/src/
  app.js            Express app: security headers, CORS allowlist, JSON body limit, routes
  server.js         Starts the app and connects to MongoDB
  config/           Environment variables and database connection
  routes/           Route modules, mounted under /api
  middleware/       Shared middleware (404, error handler; auth middleware from T1.11)
  auth/             Authentication and RBAC (T1.08 to T1.11)
  models/           Mongoose schemas
server/tests/       Jest and Supertest tests
```

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before you open your first branch. In short: never commit to `main` directly, create one branch per task, and open a pull request that fills in the template.
