# Contributing guide (G1_Mel)

This guide sets out how the team uses Git and GitHub. It applies to every member and every task.

## 1. Branching strategy

We use a simple trunk-based flow (GitHub Flow).

- `main` is the only long-lived branch. It must always build and pass CI. Once deployment is set up (T1.19), every merge to `main` deploys to Azure staging.
- `main` is protected. Nobody can push to it directly, force-push to it or delete it. All changes reach `main` through a reviewed pull request.
- Every task gets its own short-lived branch, created from the latest `main`.

### Branch names

```
<type>/<task-id>-<short-description>
```

| Type | Use for | Example |
| --- | --- | --- |
| `feature` | New functionality | `feature/T1.08-register-login` |
| `fix` | Bug fixes | `fix/T1.15-mobile-nav-overflow` |
| `docs` | Documents, diagrams, README | `docs/T1.20-test-plan` |
| `chore` | Config, tooling, dependencies, CI | `chore/T1.02-ci-pipeline` |
| `test` | Tests only | `test/T1.24-negative-auth-tests` |

Use lowercase and hyphens. Always include the task ID so every branch and pull request traces back to the sprint backlog.

## 2. Day-to-day workflow

```bash
# 1. Start from the latest main
git checkout main
git pull

# 2. Create your task branch
git checkout -b feature/T1.08-register-login

# 3. Commit small, focused changes
git add .
git commit -m "feat(auth): add bcrypt password hashing (T1.08)"

# 4. Push and open a pull request on GitHub
git push -u origin feature/T1.08-register-login
```

If `main` moves while you work, update your branch before asking for review:

```bash
git checkout main
git pull
git checkout feature/T1.08-register-login
git merge main
```

## 3. Commit messages

Format: `<type>(<area>): <what changed> (<task-id>)`

Types: `feat`, `fix`, `docs`, `chore`, `test`, `refactor`, `style`.

Examples:

- `feat(news): add category filter endpoint (T1.13)`
- `fix(ui): correct article card spacing at 360 px (T1.15)`
- `docs(test): add Sprint 1 test plan (T1.20)`

## 4. Pull requests

- Title: `T1.xx: short description`, for example `T1.08: Register and login endpoints`.
- Fill in every section of the pull request template, including the Definition of Done checklist.
- Both **CI** checks must pass before merge: **Lint, test and build**, and **Secret scan (Gitleaks)**. Save time by running `npm run lint`, `npm test` and `npm run build` locally before you push.
- At least one approving review from another member is required before merge.
- Pull requests that touch authentication, tokens or role-based access control also need a review from Anas Delowar (security reviewer).
- Resolve every review comment before merging.
- Merge with **Squash and merge**. The branch is deleted automatically after merge.
- Keep pull requests small. If a task is large, split it into several pull requests.

## 5. Reviewing

When you review, check that:

- the change does what the task and its acceptance criteria say;
- the code is readable and has no obvious bugs;
- there are no secrets, passwords, keys or `.env` files in the change;
- user input is validated and errors are handled;
- tests were added or updated where relevant.

Approve only when you would be happy to own the code yourself.

## 6. Secrets

Never commit secrets. Connection strings, JWT secrets and API keys go in a local `.env` file (ignored by Git) and in GitHub Actions secrets or Azure App Service settings for deployed environments. Commit a `.env.example` file with the variable names and dummy values instead.

Two safeguards catch mistakes: GitHub push protection blocks pushes that contain known provider tokens, and the Gitleaks check in CI scans the whole Git history for any secret. Neither replaces care.

If a secret is committed by mistake, tell the Team Lead straight away. The secret must be rotated, because deleting the commit does not remove it from Git history.

## 7. Definition of Done

A backlog item counts as done only when all of the following hold:

1. The code is peer-reviewed and merged;
2. Its acceptance criteria pass;
3. Automated tests pass in CI with no high or critical security findings;
4. It is deployed to HTTPS staging and verified on mobile and desktop, with no critical accessibility issues;
5. The Product Owner accepts it at the Sprint Review.

The checklists for authors, reviewers and story owners, and how each item is verified, are in [docs/definition-of-done.md](docs/definition-of-done.md).
