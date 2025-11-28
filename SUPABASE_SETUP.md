# Supabase Setup Instructions

## Step 1: Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click **"New project"**
3. Fill in:
   - **Name:** `ayo-copilot`
   - **Database Password:** (generate a strong password and save it)
   - **Region:** Choose closest to you (e.g., US East)
   - **Pricing Plan:** Free tier is fine for MVP
4. Click **"Create new project"**
5. Wait 2-3 minutes for project to provision

## Step 2: Enable pgvector Extension

1. In your project dashboard, go to **"Database"** → **"Extensions"**
2. Search for **"vector"**
3. Click **"Enable"** on the `vector` extension

## Step 3: Run SQL Schema

1. Go to **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Copy the entire contents of `supabase-schema.sql` file
4. Paste into the SQL editor
5. Click **"Run"** (or press Cmd/Ctrl + Enter)
6. You should see success messages for all tables and functions created

## Step 4: Get API Credentials

1. Go to **"Settings"** → **"API"** in the left sidebar
2. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **service_role key** (under "Project API keys" - this is the secret key)

## Step 5: Update .env.local

Add the credentials to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 6: Verify Setup

Run the test script:
```bash
pnpm run test:supabase
```

This will verify the connection and check that all tables exist.

---

## Troubleshooting

**Issue:** "relation does not exist" error
- **Solution:** Make sure you ran the entire SQL schema script

**Issue:** "permission denied" error
- **Solution:** Make sure you're using the `service_role` key, not the `anon` key

**Issue:** Vector search not working
- **Solution:** Verify the `vector` extension is enabled in Extensions tab

---

Once you've completed these steps, let me know and I'll proceed with loading the content!
