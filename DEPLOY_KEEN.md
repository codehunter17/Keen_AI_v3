# Deploying Keen — checklist

This is the deploy path for the **first time** Keen ships alongside NutriMama. Subsequent deploys are just `git push`.

## 0. What you need before starting

- The existing NutriMama Vercel project linked to the GitHub repo
- A Supabase / Neon Postgres with `pgvector` + `pgcrypto` enabled (Supabase has both by default)
- A free Upstash Redis (https://upstash.com — "Create Database" → copy REST URL + token)
- 10 minutes

Everything else (E2B, Twilio, YouTube, Instagram, GitHub token) can be added later. Keen's modules degrade gracefully — missing creds = a no-op, never a crash.

## 1. Install new dependencies

```bash
cd my-app
npm install
```

This pulls in `@upstash/redis` and `e2b`. Postinstall runs `prisma generate` automatically.

## 2. Migrate the database

Two options. Pick one.

### Option A — Prisma migrate (recommended if you have a separate dev DB)

```bash
npx prisma migrate dev --name keen_full
```

This generates a migration file under `prisma/migrations/<timestamp>_keen_full/` and applies it to your dev DB. **Commit the generated migration file** — Vercel will need it on deploy.

### Option B — `db push` (faster, no history, fine for solo founder)

```bash
npx prisma db push
```

Applies the schema diff directly without recording a migration. Don't use this if you already have multiple environments.

Either way, verify pgvector + pgcrypto are enabled:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

On Supabase: Dashboard → Database → Extensions → enable both. On Neon: they're enabled by default on the free tier.

## 3. Set Vercel env vars

Copy from `.env.example`. The minimum to make Keen useful on day one:

| Required | Variable |
|---|---|
| ✅ | `KEEN_OPERATOR_EMAIL` — your login email |
| ✅ | `CRON_SECRET` — `openssl rand -hex 32` |
| ✅ | `UPSTASH_REDIS_REST_URL` |
| ✅ | `UPSTASH_REDIS_REST_TOKEN` |
| ✅ | `HUGGINGFACE_TOKEN` — already needed for chat |
| ⏳ later | Twilio, E2B, GitHub, Instagram, YouTube |

`KEEN_OPERATOR_PASSPHRASE` is required only the first time you approve an L4 proposal — set it before then.

## 4. Push to GitHub → Vercel auto-deploys

```bash
git add .
git commit -m "Keen — autonomous brain v1"
git push origin main
```

Vercel detects the push, runs `npm install` (which runs `prisma generate`), and deploys. Watch the build log for Prisma client generation success.

## 5. Smoke test, in order

1. Visit `/admin` while logged in as `KEEN_OPERATOR_EMAIL` — should render. Log out → should 404.
2. Add a teacher at `/admin/teachers` (e.g. "Dr. Smita Singh / OB-GYN / trust 1.8").
3. Hit the cron manually:
   ```bash
   curl -H "Authorization: Bearer <CRON_SECRET>" https://YOUR_DOMAIN/api/keen/cron/observe
   ```
   Should return `{"ok":true,...}`. Visit `/admin` → at least one observation row.
4. Trigger the scholar harvest:
   ```bash
   curl -H "Authorization: Bearer <CRON_SECRET>" https://YOUR_DOMAIN/api/keen/cron/scholar-harvest
   ```
   Visit `/admin/scholar` → seed sources should appear, findings will land within a few minutes after Keen has open opportunities to seed from.

## 6. What runs automatically after deploy

Vercel cron will start firing on its own schedule:

| Job | Schedule | Purpose |
|---|---|---|
| `observe` | nightly 00:00 IST | Mine anonymized user signals |
| `synthesize` | weekly Sun 01:00 IST | Cluster observations → opportunities |
| `propose` | weekly Sun 01:30 IST | Draft proposals for top opportunities |
| `distribute` | weekly Sun 02:00 IST | Growth/i18n/SEO + media opportunities |
| `telemetry-drain` | every 5 min | Persist edge telemetry + flag injection / velocity |
| `optimize` | daily 09:30 IST | Self-optimization from operational metrics |
| `media-dispatch` | every 2h | Publish approved media proposals |
| `scholar-harvest` | daily 08:45 IST | PubMed harvest into trust-weighted memory |
| `scholar-conflict` | weekly Sun 11:00 IST | Surface contradictions between findings |
| `scholar-prune` | daily 11:15 IST | Archive uncited findings > 30 days old |

## 7. Day-zero IQ growth path

Right after deploy:

1. **Log 3-5 Dr. Smita Singh cases** at `/admin/cases/new` — gives Keen its highest-trust seed memory.
2. **Wait one cycle (24h).** Observe + Scholar harvest will populate the brain.
3. **Review `/admin` for the first synthesizer + proposer output.** Approve / reject. This is where the brain *starts learning what good looks like* from your judgment.
4. **Don't accept L4 proposals yet.** Keep L3 → L2 → L1 as the working set until you've built confidence.

## 8. Things that DON'T need to work for deploy to succeed

- E2B sandbox — Foundry returns `status: "skipped"` cleanly if `E2B_API_KEY` is missing
- WhatsApp — notifications drop to console logs
- GitHub PRs — Executor falls back to issue creation (or just records approval if `GITHUB_TOKEN` unset)
- YouTube / Instagram — pipeline runs in mock mode; admin sees `mock://` URLs
- ML fine-tuning — registry rows write but no actual training fires

Everything in the system gracefully no-ops on missing env vars. **Keen will be doing useful brain-work the moment Upstash + Postgres + HuggingFace are configured.**

## 9. Rollback

The only Keen change to production-critical paths is `middleware.ts`. If something breaks at the edge:

```bash
git revert <commit>
git push
```

Everything else is additive — new tables, new routes under `/api/keen/*`, new `/admin` pages. None of it touches NutriMama's existing user-facing flows.

---

Once you've done steps 1–4, Keen is alive. Steps 5–7 are about *watching it work*.
