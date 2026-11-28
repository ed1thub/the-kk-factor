# Staging environment (Azure)

Task T1.18 (US-01). This document records how the staging environment is built and secured. It contains no secrets: passwords, keys and connection strings live only in Azure App Service settings (and, once deployment is set up in T1.19, in GitHub Actions secrets).

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

Staging client URL: https://blue-plant-05f65f500.4.azurestaticapps.net

**Region note.** The plan named Australia East. The Azure for Students subscription has no App Service B1 quota in Australia East (limit 0), so the API and storage are in Australia Southeast (Melbourne). The B1 Linux list price is the same in both regions (AUD 0.027 per hour). Static Web Apps offers only five regions for its managed functions and staging environments (Central US, East US 2, East Asia, West Europe and West US 2), none of them in Australia; East Asia is the nearest. The static content itself is distributed globally, not served from that region.

## 3. Security configuration

**App Service (API)**

- HTTPS only; plain HTTP redirects to HTTPS (301)
- Minimum TLS 1.2; TLS 1.1 connections are refused
- FTP and FTPS disabled; basic-auth publishing credentials disabled for both FTP and the deployment endpoint (deployments will use GitHub Actions with Microsoft Entra ID sign-in, set up in T1.19)
- Accepts only traffic proxied through the linked static web app (direct requests return 401)
- Always On, HTTP/2
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

The end-to-end check (`/api/health` reporting `"database": "connected"` through the static web app) runs once the code is deployed in T1.19.

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
