# Sprint 1 Test Plan

The KK Factor: Online News Portal (BN304, Group G1_Mel)

| Item | Detail |
| --- | --- |
| Task | T1.20 (US-01) |
| Owner | Nur Siamul Hasan (Team Lead / Scrum Master) |
| Sprint | Sprint 1: Foundation, Security and Core News (23/11/2026 to 13/12/2026) |
| Acceptance | Product Owner (Dr Osamah A. Mahdi) at the Sprint Review on 14/12/2026 |
| Status | Baseline for Sprint 1. Extended at each Sprint Planning for Sprints 2 and 3. |

The structure of this plan follows the test plan content set out in ISO/IEC/IEEE 29119-3 [1]: context and scope, approach, environments, criteria, test cases, defect handling, roles, schedule, risks and deliverables.

## 1. Purpose and scope

This plan defines how the team proves that each Sprint 1 user story meets its acceptance criteria and the Definition of Done before the Product Owner reviews it.

**In scope (Sprint 1 backlog):**

| Story | Backlog item |
| --- | --- |
| US-01 | Repository, CI/CD, secure Azure staging and Definition of Done |
| US-02 | Validated requirements, design, architecture and streaming spikes |
| US-03 | Secure login with role-based access (Admin, Editor, Reader) |
| US-04 | Browse news by category and read articles |

**Not in this plan:** features planned for Sprints 2 and 3 (radio, music player, CMS, search, live updates) and the tests that belong to them, such as dependency scanning and CodeQL (T2.16), OWASP ZAP scanning (T3.11), load testing (T3.12), end-to-end testing (T3.13) and user acceptance testing (T3.15). They are added to this plan when their sprint starts.

## 2. Test approach

Testing is built into the development workflow rather than left to the end of the sprint. Every pull request runs the automated checks in CI, and every story is checked against its acceptance criteria before the Sprint Review.

| Level or type | What it checks | Tool | When |
| --- | --- | --- | --- |
| Static checks | Code style and common errors in client and server | oxlint (in CI) | Every pull request |
| Code review | Correctness, readability, security, tests present | GitHub pull request review (1 approval required) | Every pull request |
| Secret scanning | No credentials committed | GitHub push protection (every push); Gitleaks in CI (T1.25) | Every push; every pull request and merge to `main` |
| Unit tests | Individual functions and modules (for example password hashing, role checks) | Jest | Every pull request |
| API integration tests | Endpoints with their middleware (status codes, headers, cookies, response bodies) | Jest and Supertest | Every pull request |
| Security tests | Authentication, session and access-control controls, written from the threat model (T1.23) and the OWASP Top 10:2025 [2], following OWASP WSTG v4.2 test cases [3] | Jest and Supertest, browser developer tools | Week 2 and 3 |
| Accessibility tests | Pages against WCAG 2.2 [4] | axe [6] | Week 3 (T1.21) |
| Performance tests | Page load performance on staging | Lighthouse [5] | Week 3 (T1.26) |
| Responsive and manual checks | Layout at 360, 768 and 1280 px; main user journeys | Chrome DevTools device mode, one real phone | Week 3 (T1.26) |
| Design reviews | Wireframes, ERD, topology and workflow diagrams, spike reports | Review at the Monday workshop | Week 1 and 2 |
| Acceptance | Each story against its acceptance criteria | Live demo on staging | Sprint Review, 14/12/2026 |

Tests TC-01-01 to TC-01-03 are run from a team member's account, because the repository owner can bypass branch protection in an emergency.

**Regression suite (T1.21):** all automated tests in CI plus the manual smoke checks in Section 5.5, run on staging after the last Sprint 1 merge.

## 3. Test environments

| Environment | Purpose | Data |
| --- | --- | --- |
| Local | Development and running tests before pushing | Local MongoDB in Docker (`npm run db:up`), seed data (T1.14) |
| CI (GitHub Actions) | Automated checks on every pull request and on `main` | Tests that need a database use a disposable test database created for the run, never staging data. The exact approach is chosen in T1.12. |
| Staging (Azure) | Acceptance, accessibility, performance and security checks on the deployed system | App Service (API), Static Web Apps (client), MongoDB Atlas; seed data only |

**Test data rules:**

- Only seed data and test accounts. No real personal data.
- One test account per role (Admin, Editor, Reader) is created by the seed script. Test passwords are kept in local `.env` files and GitHub Actions secrets, never in the repository.
- Staging must run with `NODE_ENV=production`, so the tests in Section 5.3 see the same error handling as production.

## 4. Entry and exit criteria

**Entry criteria (a story is ready to test when):**

- it meets the Definition of Ready (see [definition-of-done.md](definition-of-done.md));
- its code is in a pull request (for CI and review) or merged to `main` and deployed (for staging tests).

**Exit criteria (Sprint 1 testing is complete when):**

1. Every test case in Section 5 has a recorded result.
2. Every acceptance criterion of US-01 to US-04 has passed.
3. No open Critical or High defects (Section 6).
4. Both CI checks pass on `main`.
5. Evidence is stored as described in Section 9.

## 5. Test cases

Each test case is traced to a story and its acceptance criterion. "Task" is the Sprint 1 task that builds or runs the test. Results are recorded in the test summary (T1.27 for security tests) and at the Sprint Review.

### 5.1 US-01: Repository, CI/CD, secure Azure staging and Definition of Done

Acceptance criteria: pull requests merge only when CI passes; staging deploys automatically over HTTPS within 10 minutes; DoD in the pull-request template.

| ID | Test | Expected result | Type | Task |
| --- | --- | --- | --- | --- |
| TC-01-01 | As a team member (not the repository owner), push directly to `main` without a pull request | Push rejected by branch protection | Manual | T1.01 |
| TC-01-02 | As a team member, open a pull request with a failing test | CI check fails and the merge button stays blocked | Manual | T1.02 |
| TC-01-03 | As a team member, open a pull request with no approving review | Merge blocked until one approval is given | Manual | T1.01 |
| TC-01-04 | Open a new pull request | Template appears with the Definition of Done checklist | Inspection | T1.01 |
| TC-01-05 | Merge a change to `main` and time it until the new version answers on staging | New version live on staging within 10 minutes of the merge | Manual, timed | T1.19 |
| TC-01-06 | Request the client and API over `http://` | Redirected to `https://`; no content served over plain HTTP | Manual | T1.19 |
| TC-01-07 | Open a pull request from a branch containing a dummy secret in a generic format (not a real provider token, which push protection would block before CI) | Gitleaks fails the CI check | Manual | T1.25 |

### 5.2 US-02: Validated requirements, design, architecture and streaming spikes

Acceptance criteria: client signs off key wireframes; ERD, topology and workflow diagrams reviewed; spike report issued.

| ID | Test | Expected result | Type | Task |
| --- | --- | --- | --- | --- |
| TC-02-01 | Review the five key wireframes with the client | Client sign-off recorded in the workshop notes | Review | T1.07 |
| TC-02-02 | Peer review of the ER/data model against the requirements from T1.04 | Every required entity and relationship present; review comments resolved | Review | T1.06 |
| TC-02-03 | Peer review of the architecture, network/deployment topology and CMS workflow diagrams | Diagrams match the chosen stack and hosting; review comments resolved | Review | T1.05 |
| TC-02-04 | Check the radio and real-time spike reports | Each report states what was tested, the results and a recommendation | Review | T1.16, T1.17 |
| TC-02-05 | Review the OpenAPI contract against the auth and news requirements | Contract covers every Sprint 1 endpoint; front-end mocks can be generated from it | Review | T1.22 |
| TC-02-06 | Review the threat model | STRIDE threats listed for authentication, RBAC and the API, each with at least one security test case | Review | T1.23 |

### 5.3 US-03: Secure login with role-based access (Admin, Editor, Reader)

Acceptance criteria: passwords hashed with bcrypt; tokens in httpOnly cookies; login throttled after five failures; Readers refused (HTTP 403) on admin APIs.

| ID | Test | Expected result | Type | Task |
| --- | --- | --- | --- | --- |
| TC-03-01 | Register a user, then read the stored user record | Password is stored as a bcrypt hash, never as plain text | Unit / integration | T1.12 |
| TC-03-02 | Log in with valid credentials | Success response; tokens set as cookies, not returned in the response body | Integration | T1.12 |
| TC-03-03 | Inspect the `Set-Cookie` headers after login (WSTG-SESS-02 [3]) | Cookies have `HttpOnly`, `Secure` and `SameSite` set | Integration / security | T1.24 |
| TC-03-04 | Log in with a wrong password | Generic error that does not reveal whether the account exists | Integration | T1.12 |
| TC-03-05 | Send six failed logins in a row for one account (WSTG-ATHN-03 [3]) | Sixth attempt is refused by throttling | Security | T1.24 |
| TC-03-06 | Use an expired access token, then refresh | Expired token refused; refresh issues a new token | Security | T1.24 |
| TC-03-07 | Call an admin API as a Reader (WSTG-ATHZ-02, WSTG-ATHZ-03 [3]) | HTTP 403 | Unit / security | T1.11, T1.24 |
| TC-03-08 | Call a protected API with no token | HTTP 401 | Integration | T1.11 |
| TC-03-09 | Call admin and editor APIs as Admin and as Editor | Access matches the role rules agreed in the OpenAPI contract | Unit | T1.11 |
| TC-03-10 | Trigger a server error on staging (WSTG-ERRH-02 [3]) | Generic error message; no stack trace in the response | Security | T1.24 |

These tests target the OWASP Top 10:2025 categories A01 Broken Access Control and A07 Authentication Failures [2].

### 5.4 US-04: Browse news by category and read articles

Acceptance criteria: responsive at 360, 768 and 1280 px widths; Lighthouse performance score of 80 or more; regression and axe scans pass.

| ID | Test | Expected result | Type | Task |
| --- | --- | --- | --- | --- |
| TC-04-01 | List articles, filter by category and paginate through the API | Correct articles, correct page sizes, correct totals | Integration | T1.13 |
| TC-04-02 | Request an article that does not exist | HTTP 404 with a JSON error | Integration | T1.13 |
| TC-04-03 | View home, category and article pages at 360, 768 and 1280 px | No horizontal scrolling, no overlapping or cut-off content, navigation usable | Manual | T1.26 |
| TC-04-04 | Run Lighthouse (performance) on the staging home page | Performance score of 80 or more (median of three runs, see note) | Performance | T1.26 |
| TC-04-05 | Run an axe scan on home, category, article and login pages | No critical accessibility violations (serious ones logged as Medium defects) | Accessibility | T1.21 |
| TC-04-06 | Run the regression suite on staging after the last Sprint 1 merge | All automated tests pass and all smoke checks in 5.5 pass | Regression | T1.21 |

**Lighthouse note:** scores vary between runs because of network and device conditions [5]. The team runs Lighthouse three times on the same page with the same settings (Chrome DevTools, default mobile emulation) and records the median score.

### 5.5 Manual smoke checks (staging)

Run as part of TC-04-06:

1. Home page loads over HTTPS and shows articles.
2. A category page shows only that category's articles.
3. An article page opens from a list.
4. Registration and login work for each role's test account.
5. A Reader cannot open admin pages or call admin APIs.
6. `/api/health` reports `"database": "connected"`.

## 6. Defect management

Defects are logged as GitHub Issues with the label `bug`, a severity label, the test case ID and the related task ID.

| Severity | Meaning | Effect on Definition of Done |
| --- | --- | --- |
| Critical | Security hole, data loss, or the system or a main journey is unusable | Blocks Done. Fixed before the Sprint Review. |
| High | An acceptance criterion fails, or a major function is wrong with no workaround | Blocks Done. Fixed before the Sprint Review. |
| Medium | Function wrong but a workaround exists | Does not block Done. Planned at backlog refinement. |
| Low | Cosmetic or minor issue | Does not block Done. Added to the Product Backlog. |

Any failed security test (Section 5.3) is logged as at least High.

## 7. Roles and responsibilities

Owners follow the current Sprint 1 plan.

| Role | Responsibility | Member |
| --- | --- | --- |
| Test plan owner | This plan, CI checks, deployment tests (TC-01-xx) | Nur Siamul Hasan |
| Developers | Unit and integration tests for their own code; self-check of the DoD before requesting review | All members |
| QA lead | Integration with the live API, regression suite and axe scans (T1.21) | Navdeep Arora |
| Security tester | Threat model, auth tests, negative security tests, US-04 staging checks, security test summary (T1.23, T1.12, T1.24, T1.26, T1.27) | Anas Delowar |
| Reviewers | At least one approving review per pull request; Anas Delowar also reviews authentication, token and RBAC changes | All members |
| Product Owner | Accepts or rejects each story at the Sprint Review | Dr Osamah A. Mahdi |

## 8. Schedule

| Week | Dates | Testing activities |
| --- | --- | --- |
| Week 1 | 23/11 to 29/11 | Branch protection and CI in place (TC-01-01 to TC-01-04); test plan baselined |
| Week 2 | 30/11 to 06/12 | Design reviews (5.2); unit and integration tests written alongside features; secret scanning in CI; deployment tests once staging exists |
| Week 3 | 07/12 to 13/12 | Security tests (TC-03-03 to TC-03-10); responsive, Lighthouse and axe checks; regression suite; security test summary |
| Sprint Review | 14/12 | Live demo of each acceptance criterion to the Product Owner |

Progress against this plan is checked at the Monday workshops on 30/11 and 07/12.

## 9. Test deliverables and evidence

| Deliverable | Where |
| --- | --- |
| CI run results | GitHub Actions run pages (linked from each pull request) |
| Screenshots of manual tests (branch protection, responsive layouts, HTTPS redirect) | `docs/test-evidence/sprint-1/` |
| Lighthouse reports (HTML) and axe results | `docs/test-evidence/sprint-1/` |
| Security test summary (T1.27) | `docs/test-evidence/sprint-1/` |
| Defects | GitHub Issues |

The repository is public, so evidence must never contain passwords, tokens, connection strings or personal data. Anything sensitive goes to the team's Google Drive instead.

## 10. Testing risks

| Risk | Effect on testing | Mitigation |
| --- | --- | --- |
| Automatic deployment to staging (T1.19) is not in place until Week 3 | Staging tests (TC-01-05, TC-01-06, TC-04-03 to TC-04-06, TC-03-10) squeezed into Week 3 | Staging environment provisioned early (T1.18, docs/staging.md); every test that can run locally or in CI runs first; staging tests are scheduled straight after T1.19 |
| Web vulnerabilities in authentication (risk R3 in the risk register) | Security defects found late | Threat model first (T1.23); security tests written from it; Anas Delowar reviews auth pull requests |
| Integration conflicts between modules (risk R8) | Regression failures in Week 3 | OpenAPI contract (T1.22); CI on every pull request; branches kept short |
| Lighthouse score variability | Inconsistent pass or fail on TC-04-04 | Median of three runs with fixed settings |
| Cross-site cookies between Static Web Apps and App Service | Login may work locally but fail on staging | Resolved in T1.18: the API is linked to Static Web Apps, so `/api` calls are same-site (docs/staging.md); verified by TC-03-03 on staging |

## References

[1] ISO/IEC/IEEE, *Software and systems engineering: Software testing, Part 3: Test documentation*, ISO/IEC/IEEE 29119-3:2021, Oct. 2021. [Online]. Available: https://www.iso.org/standard/79429.html. [Accessed: Nov. 28, 2026].

[2] OWASP Foundation, "OWASP Top 10:2025," Open Worldwide Application Security Project, 2025. [Online]. Available: https://owasp.org/Top10/2025/. [Accessed: Nov. 28, 2026].

[3] OWASP Foundation, *OWASP Web Security Testing Guide*, version 4.2, Dec. 2020. [Online]. Available: https://owasp.org/www-project-web-security-testing-guide/v42/. [Accessed: Nov. 28, 2026].

[4] World Wide Web Consortium (W3C), "Web Content Accessibility Guidelines (WCAG) 2.2," W3C Recommendation, Oct. 2023. [Online]. Available: https://www.w3.org/TR/WCAG22/. [Accessed: Nov. 28, 2026].

[5] Google Chrome Developers, "How Lighthouse calculates your overall Performance score," Chrome for Developers documentation. [Online]. Available: https://developer.chrome.com/docs/lighthouse/performance/performance-scoring. [Accessed: Nov. 28, 2026].

[6] Deque Systems, "axe-core: Accessibility engine for automated Web UI testing," GitHub repository. [Online]. Available: https://github.com/dequelabs/axe-core. [Accessed: Nov. 28, 2026].
