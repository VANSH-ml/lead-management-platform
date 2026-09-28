# Vansh CRM

![Vansh CRM Logo](public/vansh-logo.svg)

[![Author: Vansh Wadhwani](https://img.shields.io/badge/Author-Vansh%20Wadhwani-teal.svg)](https://github.com/vanshwadhwani)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Status: Active](https://img.shields.io/badge/Status-Active-emerald.svg)]()

**High-velocity pipeline & sales intelligence platform built by Vansh Wadhwani.** — self-hosted pipeline, contacts, follow-ups, SDR activity tracking, lead imports, and AI conversation insights.

---

## Why Vansh CRM?

Built by **Vansh Wadhwani**, Vansh CRM offers streamlined pipeline operations for high-performance sales teams:

1. A **13-stage pipeline** designed for maximum conversion
2. **SDR Performance & Activity Tracking** (logins, active time, conversion outcomes)
3. **Follow-up Discipline** — connected calls without next steps light up as real-time alerts
4. **Call Recordings & Conversation Intelligence** attached directly to contacts
5. **Zero-friction self-hosted setup** — up and running in minutes

---

## Run it in 3 steps

Requires [Docker](https://docs.docker.com/get-docker/) and Node.js 22+.

```bash
git clone https://github.com/vanshwadhwani/vansh-crm.git
cd zero-cost-crm
make setup && make dev
```

Open **[localhost:5173](http://localhost:5173)** and sign in:

```text
Email:    vansh.wadhwani@vanshcrm.com
Password: TestSeed123!
```

This is a **demo seed account** with 3 days of sample SDR activity. It never touches production.

Want conversation intelligence on your own calls? [Get in touch](mailto:support@vanshcrm.com).

`make setup` installs dependencies, starts an isolated Postgres container, applies the schema, and loads companies, contacts, and three days of SDR activity.

```bash
make reset-demo   # wipe & reseed local demo data
```

### Environment

```bash
cp .env.example .env.local          # production-style local API
cp testing/functional/.env.testing.example testing/functional/.env.testing  # demo path (make setup does this)
```

Important variables (see [`.env.example`](.env.example)):

| Variable               | Purpose                                                          |
| ---------------------- | ---------------------------------------------------------------- |
| `DATABASE_URL`         | Postgres connection string                                       |
| `JWT_SECRET`           | **Required** — long random secret                                |
| `ENABLE_API_DOCS`      | Optional — set `true` to expose Swagger UI at `/api/docs` in production |
| `ALLOWED_EMAIL_DOMAIN` | Login allow-list (`vanshcrm.com`, comma list, or `*` for any) |
| `CORS_ORIGINS`         | Allowed browser origins (comma-separated)                        |
| `AWS_*`                | Optional — required only for call-recording uploads              |

---

## Is this for you?

Use this if you:

- Have **1–10 SDRs** and no Salesforce admin
- Still live in **Sheets / Notion / WhatsApp** for deal tracking
- Care more about **daily activity + call discipline** than forecasting modules
- Want **self-hosted** data and an open codebase

Skip it if you need enterprise CPQ, multi-currency ERP integrations, or a full marketing automation suite.

---

## What's in Zero Cost CRM

| Capability            | What you get                                                  |
| --------------------- | ------------------------------------------------------------- |
| **Live dashboard**    | Follow-ups due, demos, active opps, won/lost                  |
| **13-stage pipeline** | Drag deals from lead → closed                                 |
| **Contacts**          | Champions, statuses, notes, LinkedIn                          |
| **Paste import**      | Excel / Sheets / CSV → deduped companies + contacts           |
| **Call recordings**   | Upload & play audio per contact (S3 optional)                 |
| **SDR activity**      | Logins, active/idle time, outcomes, targets                   |
| **Manager alerts**    | No login by 10:30, zero connects, missing follow-ups          |
| **Roles**             | Founder / admin / SDR                                         |
| **Self-hosted**       | Your Postgres, your rules                                     |
| **Instance settings** | Brand, stages, statuses, champion auto-move map (Settings UI) |

### Configuring your instance

Keep the **code** generic. Put company-specific values in env or the database:

| What                                                           | Where                                                                                                                                                                      |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Postgres / JWT / email domain / S3 / CORS                      | Server `.env` (`DATABASE_URL`, `JWT_SECRET`, `ALLOWED_EMAIL_DOMAIN`, …)                                                                                                    |
| Brand name, logo, pipeline stages, contact statuses            | DB `app_settings` — edit in **Settings** (founder/admin) or `PATCH /api/settings`                                                                                          |
| Champion status → pipeline stage map (`championStatusToStage`) | DB `app_settings` — edit in **Settings** (founder/admin) or `PATCH /api/settings`                                                                                          |
| Discovery questions on the company form (`discoveryQuestions`) | **API / SQL only** today — `PATCH /api/settings` or [`sql/examples/vansh-settings.sql`](sql/examples/vansh-settings.sql) (not editable in the Settings UI yet) |
| Optional first-boot brand                                      | `BRAND_NAME`, `BRAND_TAGLINE`, `BRAND_LOGO_URL` in env (seeded once)                                                                                                       |

Settings UI covers branding, stages, contact statuses, and the champion auto-move map. Discovery questions still go through the API (or the SQL example). See [`docs/API.md`](docs/API.md#settings-ui-vs-api-only) for a `PATCH` example. Keys/values in the champion map must exist in the configured status and stage lists.

---

## The SDR operating model

### Daily rhythm

1. **Morning brief** — open the dashboard; clear follow-ups due today
2. **Pipeline** — move cards only when the stage actually changed
3. **Contacts** — update status after every dial
4. **Record** — attach the call when it mattered
5. **Activity** (managers) — check who worked, who coasted, who needs coaching

### The 13-stage pipeline

```text
Lead Added
  → Discovery Call Done
  → Follow-up
  → Demo Scheduled
  → Demo Delivered
  → Commercial Proposal Shared
  → POC Kickoff
  → Client Data Received
  → POC Delivered
  → Final Negotiation
  → Closed Won | Closed Lost | Not Interested
```

### Targets (editable in Activity)

| Metric          | Default |
| --------------- | ------- |
| Calls made      | 80      |
| Follow-ups set  | 25      |
| Demos scheduled | 4       |

---

## Stack

```text
React 19 + TypeScript + Tailwind
              ↓
        Express 5 API
              ↓
          PostgreSQL 16
              ↓
     S3 (optional call recordings)
```

AWS is only required when testing uploads. Activity, pipeline, and import work without it.

Schema is applied from [`sql/schema.sql`](sql/schema.sql) (idempotent). See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## Commands

| Command           | What it does                        |
| ----------------- | ----------------------------------- |
| `make setup`      | Install, provision, migrate, seed   |
| `make dev`        | Web + API against the local demo DB |
| `make reset-demo` | Rebuild demo fixtures               |
| `make lint`       | Static checks                       |
| `make build`      | Production build                    |
| `make test`       | Unit tests                          |
| `make test-api`   | API functional tests (DB prepared)  |
| `make help`       | All targets                         |

---

## Import leads

1. Open **Import Leads**
2. Paste from Excel, Sheets, or CSV — or upload `.csv` / `.xlsx`
3. Columns: `Company · Prospect Name · Job Title · Email · Phone · Location · Employees · Industry`
4. Import — companies create/update; duplicate emails skip

Samples in the UI use synthetic `@*.example` data only.

---

## Deploy

**Vercel + PostgreSQL**

1. Import the repo in Vercel.
2. Set `DATABASE_URL`, `JWT_SECRET`, `ALLOWED_EMAIL_DOMAIN`, and optional AWS / `CORS_ORIGINS`.
3. `DATABASE_URL='postgresql://…' npm run db:migrate`
4. Deploy and hit `/api/health`.

**Docker / VPS**

```bash
# create .env with production secrets (never commit it)
make docker-build
make docker-up
make health
```

Root `docker-compose.yml` runs the app container; Postgres is external (managed DB or your own). Local demo Postgres is provided by `testing/functional/docker-compose.yml` via `make setup`.

---

## Security

- Do **not** ship demo credentials or `testing/functional/.env.testing` to production.
- Use a strong unique `JWT_SECRET`, verified TLS for Postgres, configured `CORS_ORIGINS`, and private object storage.
- Report vulnerabilities privately — see [SECURITY.md](SECURITY.md).

**If you ever committed real secrets to git:** rotate them immediately. History rewrite does not protect prior clones or forks.

---

## Branding & trademarks

MIT covers the **code**. The Vansh CRM name, logo, and marketing assets in `public/` are copyright Vansh Wadhwani. Forks may keep attribution or replace branding; do not imply official endorsement.

Google Fonts (DM Sans, Instrument Serif) are loaded from Google’s CDN under their respective OFL licenses. See [NOTICE](NOTICE).

---

## Contributing

We welcome first-time PRs. Maintainers aim to reply within a day on claimed issues.

| Start here                 | Link                                                                                                                                                       |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Beginner tickets           | [good first issue](https://github.com/vanshwadhwani/vansh-crm/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22+no%3Aassignee) (unassigned)    |
| Showcase / delightful work | [`fun` label](https://github.com/vanshwadhwani/vansh-crm/issues?q=is%3Aissue+is%3Aopen+label%3Afun)                                                       |
| How to claim + ship        | [CONTRIBUTING.md](CONTRIBUTING.md)                                                                                                                         |
| Rewards + onboarding       | [#23 Start here](https://github.com/vanshwadhwani/vansh-crm/issues/23)                                                                                     |
| Ideas & questions          | [Discussions](https://github.com/vanshwadhwani/vansh-crm/discussions)                                                                                      |
| Hall of fame               | [CONTRIBUTORS.md](CONTRIBUTORS.md)                                                                                                                         |

```bash
make setup && make dev
npm test
```

<a href="https://github.com/vanshwadhwani/vansh-crm/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=vanshwadhwani/vansh-crm" alt="Contributors to Vansh CRM" />
</a>

---

## License

[MIT](LICENSE) © 2026 Vansh Wadhwani

---

**Built by [Vansh Wadhwani](https://github.com/vanshwadhwani)**  
_High-velocity pipeline & sales intelligence._

[GitHub](https://github.com/vanshwadhwani/vansh-crm) · [support@vanshcrm.com](mailto:support@vanshcrm.com)
