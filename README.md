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

The `client/` and `server/` folders and the local setup steps are added in task T1.03.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before you open your first branch. In short: never commit to `main` directly, create one branch per task, and open a pull request that fills in the template.
