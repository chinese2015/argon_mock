# Argon — Synthetic Vulnerability Remediation Demo

This is a **fictional** security findings dashboard: enterprise-blue frontend, local scripted AI helper, Spring Boot REST backend, and double-opt-in email digest subscriptions. No employer brand, employee identity, real asset or resource ID, source photo/video, or production security finding is included.

## 1. Explore the frontend without installation

Open `Argon_Standalone_Demo.html` directly in Chrome/Edge. Search/filter/sort, open findings, edit responses, and use **Ask AI**. The standalone HTML operates entirely offline. Its **Email Digest** form is a preview: actual subscriptions require the backend.

Alternatively serve `frontend/` as static files. JavaScript and styles are in separate readable files.

## 2. Run the full stack (Java 17+, Maven 3.9+)

```bash
cd backend
mvn spring-boot:run
# Browse http://localhost:8080/
# Health: curl http://localhost:8080/api/health
```

The Spring Boot server serves the entire frontend from `src/main/resources/static`. It also seeds **234 synthetic findings** to a persistent, local H2 database under `backend/data/argon-demo.mv.db`, exposes REST endpoints, and runs a scheduled digest job at **08:00 UTC every day**. Weekly subscriptions deliver on Monday.

**Default email mode is preview**: all email messages are written as `.eml` files under `backend/data/outbox/`. **Nothing is sent over SMTP.** Even in backend mode, the AI Chatbox is a scripted offline helper, not a real LLM. New findings and owner updates are synthetic/demo only.

To see a full end-to-end subscription without external email:

1. Open the browser at `http://localhost:8080` and click **Subscribe to findings**.
2. Enter a *test* email, frequency, minimum risk level and optional demo application scope.
3. Open the latest `.eml` under `backend/data/outbox/`, copy its `#confirm=...` link into your browser, and click **Confirm subscription**.
4. To generate the digest immediately (rather than wait for the scheduler), **from the same machine** run:

   ```bash
   curl -X POST http://127.0.0.1:8080/api/demo/digests/run
   ```

5. Read the new digest `.eml` in `backend/data/outbox/`. It includes a working `#unsubscribe=...` link.

The local manual trigger is rejected in SMTP mode and for non-loopback clients. Do not put the demo backend behind a public reverse proxy; a proxied request can appear to originate on loopback.

## 3. Enable explicit, restricted SMTP (test accounts only)

```bash
MAIL_MODE=smtp \
SMTP_HOST=smtp.example.test SMTP_PORT=587 \
SMTP_USER=your_demo_user SMTP_PASSWORD=your_demo_password \
MAIL_FROM=argon-demo@example.test \
PUBLIC_BASE_URL=https://your-approved-demo-host.example \
SMTP_ALLOWED_RECIPIENTS=your-test-mailbox@example.test \
mvn spring-boot:run
```

This deliberately requires **both** `MAIL_MODE=smtp` and an exact recipient allowlist in `SMTP_ALLOWED_RECIPIENTS`. Mail is refused if the recipient is not in that list. Do not use real employee distributions, real vulnerability details, or real corporate asset inventories in this sample. To change delivery time/zone, update `notification.cron` and `notification.zone` in `application.yml`.

## 2.1 M0 data baseline for the Argon AI Brain (plan §2.2/§2.3)

The seed data now matches the plan's baseline exactly: **234** findings, **64** CRITICAL / **133** HIGH / **37** MEDIUM, **199** Not Started / **26** In Progress (seed-only simulation, *not* AI-taken-over) / **9** Resolved, **225** Open. The Overview page aggregates **live from the backend** (`GET /api/findings/stats`) instead of hardcoded numbers.

Each finding carries the M0 minimal fields: `revision, ownerId, ownerTeamsId, repositoryId, repositoryUrl, baseBranch, baseCommit, ruleId, scanRunId, workItemId, remediationJobId, triageResult, codeFixCommit, prUrl, verificationResult` plus `sourcePath/lineRange` for the code-mapped demos.

Three findings are mapped to **real, reproducible demo code** under `demo-repos/` (each a git repo with failing baseline security tests):

| Finding | Repo | CWE | Vulnerable code | Baseline test result |
|---|---|---|---|---|
| `FND-00003` | `demo-orion-notes-api` | CWE-798 Hardcoded Credentials | `AppConfig.java:10` | 2 failing tests |
| `FND-00009` | `demo-nova-catalog-api` | CWE-89 SQL Injection | `CatalogSearchService.java:23` | `maliciousInputReturnsNothing` fails |
| `FND-00015` | `demo-pixel-reports-batch` | CWE-22 Path Traversal | `ReportImporter.java:21` | `blocksTraversalOutsideReportDirectory` fails |

`demo-repos/demo-customer-api` holds the fictional Jira **DEV-142** pagination bug for Workflow B demos. To reseed from scratch: stop the backend, delete `backend/data/`, and restart.

PATCH quality gate: a finding bound to a `remediationJobId` cannot be set to `Resolved` until `verificationResult=PASSED` (HTTP 409 otherwise) — the UI never closes AI-driven findings on model claims alone.

## API sketch

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Backend status |
| GET | `/api/findings` | List 234 fictional findings |
| GET | `/api/findings/{id}` | Fetch finding |
| GET | `/api/findings/stats` | Live-aggregated overview statistics |
| PATCH | `/api/findings/{id}` | Save owner response, remediation status, triage/verification/PR write-backs |
| GET | `/api/cases` | List mock remediation cases |
| POST | `/api/cases` | Create mock case |
| POST | `/api/subscriptions` | Request a **pending**, unconfirmed digest subscription |
| POST | `/api/subscriptions/confirm` | Activate with emailed confirmation token |
| POST | `/api/subscriptions/unsubscribe` | Cancel with emailed unsubscribe token |
| POST | `/api/demo/digests/run` | Local manual run in `preview` mode only |

Example subscription:

```bash
curl -X POST http://localhost:8080/api/subscriptions \
  -H 'Content-Type: application/json' \
  -d '{"email":"tester@example.test","frequency":"DAILY","minRisk":"HIGH","appCode":"DEMO-APP-001"}'
```

The server responds `202 Accepted`; a confirmation `.eml` is written locally. There is **no active subscription until confirmed**. Confirmation tokens expire after 48 hours. The digest includes open findings in the chosen app/minimum-risk scope, sorted by score, maximum 20 rows plus a total count. Duplicate digests on the same UTC calendar day are suppressed for each subscription. Changing from daily to weekly requires a new subscription workflow.

## What is deliberately NOT production-ready

- Public REST endpoints have **no login, RBAC, SSO, CSRF protection, per-IP rate limiting or audit trail**. The service binds to `127.0.0.1` by default. Run only on a private developer workstation with synthetic data; the sample Dockerfile binds inside its container to `0.0.0.0` so **do not publish its port on a public network**. Add Spring Security before exposing any service.
- `ddl-auto=update` and H2 are for the demo only. Add Flyway/PostgreSQL and a migration strategy for any shared deployment.
- Email scheduling is an in-process `@Scheduled` job (not distributed, transactional outbox or reliable queues). For clustered/production use, add durable jobs, idempotency and retry/dead-letter handling.
- Unsubscribe capability tokens are saved in the local demo database to support durable unsubscribe links. Replace with server-side signed links and a managed key in a hardened system.
- New subscription requests are deduplicated by email/app scope with basic time gating; add anti-abuse controls, verification hardening, monitoring and delivery failure handling.
- Owner comment and status sync to the backend when available; attachments remain local filename-only metadata, not uploaded binaries. Other prototype controls may be local-only.
- AI Enhance is **scripted**, not connected to a model. Do not send real vulnerability content to any external LLM without company approval.
- The blue palette is a generic enterprise treatment with no copied corporate logo or wordmark. UI layout is a prototype reference, not an authorized port of a private system.

## Project layout

```
Argon_Standalone_Demo.html      # offline single-file frontend
frontend/                       # readable frontend sources
backend/pom.xml                 # Spring Boot 3.5.x + Java 17
backend/src/main/java/          # synthetic APIs + scheduler + preview email
backend/src/main/resources/     # H2 app settings + served static frontend
backend/src/test/               # JUnit integration test sources
```

Run `mvn test` in `backend/` to execute the Spring Boot integration tests.
