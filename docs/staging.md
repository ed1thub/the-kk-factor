# Staging environment (Azure)

Tasks T1.18 and T1.19 (US-01). This document records how the staging environment is built and secured. It contains no secrets: passwords, keys and connection strings live only in Azure App Service settings and in the GitHub `staging` environment secrets.

## 1. Architecture

```
Browser
  |  HTTPS
  v
Azure Static Web Apps (Standard)            serves the React client
  |  /api/* is proxied to the linked backend (same site for the browser)
  v
Azure App Service (Linux, B1, Node 22 LTS)  runs the Express API
  |  TLS, IP access list + database user
  v
MongoDB Atlas (M0, AWS Sydney)              database "kkfactor"

Azure Blob Storage (private container "media")  used by the media upload task (T2.12) in Sprint 2
```

**Why the API is linked to Static Web Apps.** The client and the API would otherwise sit on two different sites (`*.azurestaticapps.net` and `*.azurewebsites.net`). Browsers such as Safari block cookies on cross-site requests by default, so cookie-based login (T1.09) would fail on iPhones. Linking the API makes every `/api` call same-site, so authentication cookies work in all browsers and can use `SameSite=Strict` or `Lax`. A linked App Service also accepts only requests proxied through the static web app.

## 2. Resources

| Resource | Name | Region | Plan / SKU |
| --- | --- | --- | --- |
| Resource group | `rg-kkfactor-staging` | Australia East (metadata only) | |
| App Service plan | `asp-kkfactor-stg` | Australia Southeast | B1, Linux |
| App Service (API) | `kkfactor-api-stg-32326` | Australia Southeast | Node 22 LTS |
| Static Web App (client) | `swa-kkfactor-stg` | East Asia (content served globally) | Standard |
| Storage account | `stkkfactorstg32326` | Australia Southeast | Standard LRS, StorageV2, Hot |
| Database | Atlas cluster `kkfactor-staging` | AWS Sydney (ap-southeast-2) | M0 (free) |
| Deployment identity | Managed identity `id-kkfactor-deploy` | Australia Southeast | User-assigned managed identity |

Staging client URL: https://blue-plant-05f65f500.4.azurestaticapps.net

**Region note.** The plan named Australia East. The Azure for Students subscription has no App Service B1 quota in Australia East (limit 0), so the API and storage are in Australia Southeast (Melbourne). The B1 Linux list price is the same in both regions (AUD 0.027 per hour). Static Web Apps offers only five regions for its managed functions and staging environments (Central US, East US 2, East Asia, West Europe and West US 2), none of them in Australia; East Asia is the nearest. The static content itself is distributed globally, not served from that region.

## 3. Security configuration

**App Service (API)**

- HTTPS only; plain HTTP redirects to HTTPS (301)
- Minimum TLS 1.2; TLS 1.1 connections are refused
- FTP and FTPS disabled; basic-auth publishing credentials disabled for both FTP and the deployment endpoint (deployments use GitHub Actions with Microsoft Entra ID sign-in, see Section 6)
- Accepts only traffic proxied through the linked static web app (direct requests return 401)
- Always On, HTTP/2
- Startup command `node src/server.js`; `SCM_DO_BUILD_DURING_DEPLOYMENT=false` (the deployment package already contains the production dependencies)
- App settings: `NODE_ENV=production` (no stack traces in error responses), `CLIENT_ORIGIN` (the static web app URL), `MONGODB_URI` (secret)

**Storage**

- HTTPS only, minimum TLS 1.2
- Public blob access disabled at account level; container `media` is private (files will be shared through time-limited SAS URLs in Sprint 2)

**MongoDB Atlas**

- IP access list contains only the App Service's possible outbound IP addresses (19 entries, each a single `/32` address); no `0.0.0.0/0`
- Database user `kkfactor-api-stg`: SCRAM password authentication, privilege `readWrite` on database `kkfactor` only (no admin roles, no access to other databases); the password is stored only in the `MONGODB_URI` App Service setting
- Sample dataset not loaded

**If the App Service outbound IPs change** (for example after a plan change), update the Atlas IP access list from:

```bash
az webapp show -g rg-kkfactor-staging -n kkfactor-api-stg-32326 --query possibleOutboundIpAddresses -o tsv
```

## 4. Verification (28/11/2026)

| Check | Result |
| --- | --- |
| Direct HTTPS request to the API | 401 (only proxied traffic accepted) |
| Plain HTTP request to the API | 301 redirect to HTTPS |
| TLS 1.1 request to the API | Refused |
| Static web app front end | 200 |
| App Service settings present | `CLIENT_ORIGIN`, `MONGODB_URI`, `NODE_ENV` |
| `MONGODB_URI` format (checked without displaying the value) | Correct user, host, database and options; Atlas SRV record resolves |
| Atlas database user privileges | `readWrite@kkfactor` only |
| Atlas IP access list | Exactly the 19 App Service outbound IPs |

**After the first automatic deployment (T1.19, 28/11/2026):**

| Check | Result |
| --- | --- |
| `/api/health` through the static web app | `{"status":"ok","database":"connected"}` (App Service reaches Atlas) |
| Plain HTTP request to the client | 301 redirect to HTTPS (TC-01-06) |
| Plain HTTP request to the API | 301 redirect to HTTPS (TC-01-06) |
| Direct HTTPS request to the API | 401 (only proxied traffic accepted) |
| Client-side route refreshed in the browser | 200 (served `index.html`) |
| Unknown `/api` path through the static web app | 404 with a JSON error from the API |
| Client response headers | `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy` present |
| API response headers | Helmet `Content-Security-Policy` present; no `X-Powered-By` |
| Deployment workflow smoke test | Passed |

## 5. Cost control

Prices are Azure list prices in AUD (Azure Retail Prices API, 28/11/2026).

| Item | Price | Approx. per month |
| --- | --- | --- |
| App Service B1 Linux (Australia Southeast) | AUD 0.027 per hour | AUD 19.71 |
| Static Web Apps Standard | AUD 12.79 per app per month | AUD 12.79 |
| Blob Storage | usage based (test files only) | cents |
| MongoDB Atlas M0 | free | AUD 0 |
| **Total** | | **about AUD 32.50** |

- Funded from the Azure for Students credit.
- Subscription budget `kkfactor-budget`: AUD 100, with email alerts to the subscription owner at 50%, 80% and 100% of actual spend and at 100% of forecast spend.

## 6. Deployment (T1.19)

Workflow: `.github/workflows/deploy.yml`.

1. Starts when the CI workflow succeeds for a push to `main`, so only code that passed lint, tests, the build and the secret scan is deployed. It can also be started by hand from the Actions tab.
2. Builds the client and uploads it to Static Web Apps.
3. Packages the API with its production dependencies only and deploys it to App Service.
4. Smoke test through the static web app (the same path a browser uses): the home page must load over HTTPS and `/api/health` must report `"database": "connected"` within 3 minutes, otherwise the run fails.

| Target | How the workflow signs in | Stored in GitHub (`staging` environment) |
| --- | --- | --- |
| App Service (API) | OpenID Connect as managed identity `id-kkfactor-deploy`. Its federated credential trusts only tokens for subject `repo:ed1thub@152958274/the-kk-factor@1424129467:environment:staging` (GitHub includes the owner and repository ID numbers, so a renamed or recreated repository with the same name is not trusted). Role: Website Contributor on the API web app only. | `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID` (identifiers, not passwords) |
| Static Web Apps (client) | Deployment token | `AZURE_STATIC_WEB_APPS_API_TOKEN` (secret) |

- The GitHub environment `staging` accepts deployments only from protected branches (`main`), and its secrets are available only to jobs that deploy to it.
- No Azure password or publish profile exists in GitHub; basic-auth publishing stays disabled on the App Service.
- Actions in the workflow are pinned to full commit SHAs, as in CI.
- If the Static Web Apps deployment token is ever exposed, reset it in the Azure portal (Static Web App, Overview, Manage deployment token, Reset) and update the GitHub secret.

**Client routing and headers** (`client/public/staticwebapp.config.json`): any path that is not under `/api` and is not a file is served `index.html`, so refreshing a page on a client-side route does not return 404. The static web app also sends `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options` and `Referrer-Policy` headers; the full content security policy is set in T2.15.
