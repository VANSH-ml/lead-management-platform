# Local testing against a live database

Use this when you want to run Vansh CRM locally pointed at a remote or staging Postgres instance (e.g. an RDS database via SSH tunnel) instead of the local demo DB.

## Goal

- Run **Vansh CRM** on `localhost:5173`
- Talk to a **remote Postgres** instance
- Keep all existing users / companies / contacts
- Apply Vansh CRM branding + contact statuses via DB settings (not a code change)

## Why an SSH tunnel?

If your database is inside a private network (VPC / security group), you cannot open TCP `5432` directly from your laptop. Forward a local port through your jump host instead:

```bash
ssh -N -L 5433:<rds-host>:5432 <ec2-user>@<ec2-host>
```

Leave that terminal open. Check the tunnel is up:

```bash
nc -z -w 2 127.0.0.1 5433 && echo tunnel_ok
```

## 1. Create your .env.local

Copy the example and fill in your remote connection details:

```bash
cp .env.example .env.local
```

Key values for a tunnelled remote DB:

```env
DATABASE_URL=postgresql://<user>:<pass>@127.0.0.1:5433/<dbname>
DB_URL_DEV=postgresql://<user>:<pass>@127.0.0.1:5433/<dbname>
DB_SSL=true
JWT_SECRET=<same-secret-as-remote-so-sessions-stay-valid>
ALLOWED_EMAIL_DOMAIN=vanshcrm.com
```

Do **not** commit `.env.local`.

## 2. Apply schema + Vansh CRM settings

From the repo root:

```bash
# Apply schema (idempotent)
DATABASE_URL="$(grep ^DATABASE_URL .env.local | cut -d= -f2-)" npm run db:migrate

# Apply Vansh CRM branding / stages / statuses
psql "$DATABASE_URL" -f sql/examples/vansh-settings.sql
```

This does not touch the `users` table.

## 3. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and sign in with an existing account on the remote DB.

Smoke checklist:

- [ ] Login works for an existing user
- [ ] Pipeline shows existing companies
- [ ] Contacts show the correct statuses
- [ ] Settings page shows Vansh CRM branding (founder/admin)
- [ ] Call recording upload/play if you use S3

## Safety notes

- Never run demo/test seed scripts against a production database
- Schema migrations are idempotent — safe to re-run
- The `users` table is never modified by the settings SQL
- If a migration fails mid-way, fix and re-run
