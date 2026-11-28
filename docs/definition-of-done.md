# Definition of Ready and Definition of Done

The KK Factor: Online News Portal (BN304, Group G1_Mel). Task T1.20 (US-01).

The wording of both definitions is the wording agreed in the Sprint Plan. This document adds the checklist the team uses to apply them, and how each item is verified. The test cases referred to below are in [test-plan.md](test-plan.md).

## 1. Definition of Ready

A story may enter a sprint only when it has:

- [ ] agreed acceptance criteria;
- [ ] a story-point estimate;
- [ ] tasks of no more than 12 hours;
- [ ] identified dependencies;
- [ ] (for UI work) an approved wireframe.

Checked by the Scrum Master at Sprint Planning and backlog refinement.

## 2. Definition of Done

A backlog item counts as done only when all of the following hold:

1. The code is peer-reviewed and merged;
2. Its acceptance criteria pass;
3. Automated tests pass in CI with no high or critical security findings;
4. It is deployed to HTTPS staging and verified on mobile and desktop, with no critical accessibility issues;
5. The Product Owner accepts it at the Sprint Review.

## 3. How each item is verified

| # | DoD item | How it is verified | Who | Evidence |
| --- | --- | --- | --- | --- |
| 1 | Peer-reviewed and merged | At least one approving review from another member, then **Squash and merge** into `main`. Authentication, token and RBAC changes also reviewed by the security reviewer. | Reviewer | Approved and merged pull request |
| 2 | Acceptance criteria pass | Every test case linked to the story's acceptance criteria has passed | Task owner, then QA lead | Test case results (test plan, Section 5) |
| 3 | CI passes with no high or critical security findings | The **Lint, test and build** check passes; secret scanning reports nothing; in Sprint 1 the reviewer also runs `npm audit --audit-level=high` locally until dependency scanning is automated in T2.16 | Author and reviewer | CI run linked from the pull request |
| 4 | Deployed to HTTPS staging, verified on mobile and desktop, no critical accessibility issues | Change is live on staging over HTTPS; UI changes checked at 360 px (mobile) and 1280 px (desktop); axe shows no critical violations on changed pages. API-only changes are verified by calling the endpoint on staging. | Task owner | Screenshots and axe results in `docs/test-evidence/` |
| 5 | Product Owner accepts it at the Sprint Review | Live demonstration of each acceptance criterion | Product Owner | Sprint Review notes |

## 4. Checklists

### 4.1 Before requesting a review (author)

- [ ] Branch and pull request title include the task ID
- [ ] The task's acceptance criteria are met
- [ ] Tests added or updated; `npm test` passes locally
- [ ] `npm run lint` and `npm run build` pass locally
- [ ] No secrets, passwords, keys or `.env` files in the change
- [ ] User input is validated and errors are handled (API changes)
- [ ] Documentation updated if behaviour or setup changed
- [ ] Pull request template filled in; reviewer requested

### 4.2 Before approving (reviewer)

- [ ] The change does what the task says, and nothing unrelated
- [ ] Code is readable; no obvious bugs or leftover debug code
- [ ] Tests cover the new behaviour, including at least one failure case
- [ ] No secrets or personal data in code, tests or screenshots
- [ ] `npm audit --audit-level=high` reports no high or critical findings
- [ ] CI check is green

### 4.3 Before the Sprint Review (story owner)

- [ ] All tasks in the story are merged
- [ ] All linked test cases have passed and results are recorded
- [ ] Deployed to HTTPS staging and checked on mobile and desktop
- [ ] No open Critical or High defects for the story
- [ ] Demo steps prepared for each acceptance criterion

## 5. Sprint 1 notes

- **Staging arrives in Week 3.** Until T1.18 and T1.19 are complete, items can satisfy DoD items 1 to 3 but not item 4. They are recorded as "merged, waiting for staging" and completed once staging is live.
- **Accessibility threshold.** "No critical accessibility issues" is measured with axe, which rates each issue as minor, moderate, serious or critical. Critical issues block Done. Serious issues are logged as Medium defects and planned at backlog refinement.
- **Severity levels** for defects are defined in the test plan, Section 6.
