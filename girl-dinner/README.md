# girl dinner™

## Adding & editing recipes

All content is managed through the **admin panel** at `/admin` on the live site.

Sign in with your account, then use the admin dashboard to add, edit, or delete recipes and cocktails. Changes go live immediately — no GitHub editing or redeployment needed.

### Recipe fields

| Field | Required | Notes |
|-------|----------|-------|
| `name` | Yes | Display name |
| `vibe` | Yes | One short witty line |
| `ingredients` | Yes | One per line in the textarea |
| `moods` | No | Select any of: soft, feral, fancy, hungover |

Cocktails are the same, except `vibe` is optional.

### Valid moods

| Mood | When to use |
|------|-------------|
| `soft` | cozy, calm, gentle energy |
| `feral` | chaotic, unhinged, no thoughts |
| `fancy` | bougie, treating yourself |
| `hungover` | survival mode |

`moods` is optional — leave unchecked and the item appears for all moods.

---

## Developer setup

### Prerequisites

1. Vercel project linked — run `vercel link`
2. Neon Postgres integration added via Vercel Marketplace
3. Clerk integration added via Vercel Marketplace
4. Pull env vars: `vercel env pull .env.local`

### First-time DB setup

```bash
# Apply the schema
npm run db:push

# Seed from existing JSON (run once)
npm run db:seed
```

### Local dev

```bash
npm run dev
```

### Make yourself admin

After creating your account on the site, go to the [Clerk dashboard](https://dashboard.clerk.com), find your user, and set `publicMetadata` to:

```json
{ "role": "admin" }
```

The `/admin` link will appear in the top-right corner after your next sign-in.
