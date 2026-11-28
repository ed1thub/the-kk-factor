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

## Project objectives

From the project proposal:

- An online news portal with categories, search and real-time updates
- Live radio streaming, so users can listen to broadcast stations in the application
- A music player with playlists, audio controls and background playback
- A content management system (CMS) for administrators to manage articles, media and live content schedules
- A responsive, user-friendly UI/UX across all devices
- Scalability and security, including user authentication and role management

## Technology stack

- Front end: React, built with Vite
- Back end: Node.js and Express, with Socket.IO for real-time updates over WebSockets
- Database: MongoDB Atlas (a local MongoDB in Docker for development)
- Streaming: Icecast/SHOUTcast radio streams played through the HTML5 Audio API
- Hosting: Azure Static Web Apps (front end), Azure App Service (API) and Azure Blob Storage (media)
- Source control and CI/CD: Git, GitHub and GitHub Actions

Socket.IO, streaming, Blob Storage and the Azure deployment are added by later tasks; this README is updated as each one lands.

## Repository structure

```
client/     React (Vite) front end
server/     Express API
.github/    Pull request template and code owners (CI/CD workflows from T1.02)
```

## Local setup

### Prerequisites

- Node.js 22 LTS, version 22.12 or later (`.nvmrc` is provided; run `nvm use` if you use nvm)
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
server/
  src/
    app.js          Express app: security headers, CORS allowlist, JSON body limit, routes
    server.js       Starts the app and connects to MongoDB
    config/         Environment variables (env.js) and database connection (db.js)
    routes/         Route files, mounted under /api (healthRoutes.js; auth and article routes to come)
    controllers/    Request handlers called by the routes (healthController.js; more to come)
    middleware/     Shared middleware (errorMiddleware.js; auth and role middleware to come)
    models/         Mongoose schemas
  scripts/          One-off scripts such as the database seed
  docs/             API documentation, including the OpenAPI contract
  tests/            Jest and Supertest tests
```

Each folder that is still empty has a short README saying which task fills it.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before you open your first branch. In short: never commit to `main` directly, create one branch per task, and open a pull request that fills in the template.
