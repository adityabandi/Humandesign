## ✅ Objective

Static client app (HTML/JS). Collect **100-Q psychology quiz + REQUIRED birth data** including email, compute **quiz + HD chart** in the browser, then **persist everything to Supabase and SheetDB**. Results are fetched by **public\_id + secret** via **RPCs** (no direct table reads). Render **integrated preview** and a **printable full report**. Stripe checkout is separate; purchase state stored in DB.

### ✨ Recent Enhancements

- **Email Required**: Email field is now mandatory for all submissions
- **User-Friendly Language**: Replaced technical jargon with accessible language
- **Location API**: Added location autocomplete with geocoding support
- **SheetDB Integration**: Added Google Sheets data collection (see SHEETDB_SETUP.md)
- **Enhanced UX**: Improved form validation and user guidance

---

## 🔧 Supabase: SQL schema (run in SQL editor)

```sql
-- extensions
create extension if not exists pgcrypto;

-- users (optional; email can be null for frictionless flow)
create table if not exists users_public (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  name text,
  created_at timestamptz default now()
);

-- raw quiz answers + derived
create table if not exists quiz_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users_public(id) on delete set null,
  answers jsonb not null,          -- array of 100 numbers
  derived jsonb not null,          -- {type, authority, profileCandidates, centersTendency, scores...}
  created_at timestamptz default now()
);

-- chart birth data + derived
create table if not exists charts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users_public(id) on delete set null,
  birth jsonb not null,            -- {name,date,time,tz,place}
  derived jsonb not null,          -- {type, authority, profile, definition, centers, gates, channels...}
  created_at timestamptz default now()
);

-- canonical result (ties quiz + chart + insights)
create table if not exists results (
  id uuid primary key default gen_random_uuid(),
  public_id uuid unique not null default gen_random_uuid(), -- shareable id in URL
  user_id uuid references users_public(id) on delete set null,
  quiz_id uuid references quiz_answers(id) on delete cascade,
  chart_id uuid references charts(id) on delete cascade,
  insights jsonb not null,         -- array of short bullets
  purchased boolean not null default false,
  secret text not null default encode(gen_random_bytes(18),'hex'), -- kept on client/localStorage
  created_at timestamptz default now()
);

-- purchases (optional, for Stripe status)
create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users_public(id) on delete set null,
  result_id uuid references results(id) on delete cascade,
  provider text not null default 'stripe',
  status text not null,            -- created|paid|failed|refunded
  raw jsonb,                       -- checkout/session payload
  created_at timestamptz default now()
);

-- helpful indexes
create index if not exists idx_quiz_user     on quiz_answers(user_id);
create index if not exists idx_chart_user    on charts(user_id);
create index if not exists idx_results_user  on results(user_id);
create index if not exists idx_results_public on results(public_id);
```

### 🔐 RLS (Row Level Security)

We'll **deny direct table reads** and expose **RPCs (security definer)** for safe access.

```sql
alter table users_public enable row level security;
alter table quiz_answers enable row level security;
alter table charts enable row level security;
alter table results enable row level security;
alter table purchases enable row level security;

-- Minimal permissive inserts (MVP). Direct selects blocked.
create policy anon_insert_users     on users_public for insert to anon with check (true);
create policy anon_insert_quiz      on quiz_answers for insert to anon with check (true);
create policy anon_insert_chart     on charts for insert to anon with check (true);
create policy anon_insert_results   on results for insert to anon with check (true);
create policy anon_insert_purchases on purchases for insert to anon with check (true);

-- No SELECT/UPDATE/DELETE policies → blocked by default.
```

### 🧠 RPCs (security definer)

Single call to create everything; a safe getter; and a purchase marker.

```sql
-- 1) Create full result in one shot
create or replace function create_full_result(
  p_name text,
  p_email text,
  p_birth jsonb,
  p_quiz_answers jsonb,
  p_quiz_derived jsonb,
  p_chart_derived jsonb,
  p_insights jsonb
) returns table(public_id uuid, secret text) 
language plpgsql
security definer
as $$
declare v_user_id uuid;
declare v_quiz_id uuid;
declare v_chart_id uuid;
declare v_result_id uuid;
begin
  -- upsert user on email if provided
  if p_email is not null and length(p_email) > 3 then
    insert into users_public(email, name) values (p_email, p_name)
    on conflict (email) do update set name=excluded.name
    returning id into v_user_id;
  else
    insert into users_public(name) values (p_name) returning id into v_user_id;
  end if;

  insert into quiz_answers(user_id, answers, derived)
    values (v_user_id, p_quiz_answers, p_quiz_derived)
    returning id into v_quiz_id;

  insert into charts(user_id, birth, derived)
    values (v_user_id, p_birth, p_chart_derived)
    returning id into v_chart_id;

  insert into results(user_id, quiz_id, chart_id, insights)
    values (v_user_id, v_quiz_id, v_chart_id, p_insights)
    returning public_id, secret into public_id, secret;

  return;
end; $$;

-- 2) Fetch a result safely by public_id + secret
create or replace function get_result(
  p_public_id uuid,
  p_secret text
) returns jsonb
language plpgsql
security definer
as $$
declare payload jsonb;
begin
  select jsonb_build_object(
    'user', jsonb_build_object('id', u.id, 'name', u.name, 'email', u.email),
    'quiz', q.derived,
    'chart', c.derived,
    'insights', r.insights,
    'purchased', r.purchased,
    'birth', c.birth
  )
  into payload
  from results r
  join quiz_answers q on q.id = r.quiz_id
  join charts c on c.id = r.chart_id
  left join users_public u on u.id = r.user_id
  where r.public_id = p_public_id and r.secret = p_secret;

  if payload is null then
    raise exception 'Not found or secret mismatch';
  end if;

  return payload;
end; $$;

-- 3) Mark purchase (client-side MVP; replace later with Stripe webhook)
create or replace function mark_purchase(
  p_public_id uuid,
  p_secret text,
  p_status text,
  p_raw jsonb
) returns void
language plpgsql
security definer
as $$
declare v_id uuid;
begin
  update results
    set purchased = (p_status = 'paid')
  where public_id = p_public_id and secret = p_secret
  returning id into v_id;

  if v_id is null then
    raise exception 'Result not found or secret mismatch';
  end if;

  insert into purchases(user_id, result_id, status, raw)
  select r.user_id, r.id, p_status, p_raw from results r where r.id = v_id;
end; $$;
```

> In **Auth → Policies**, allow `anon` to **execute RPCs** `create_full_result`, `get_result`, `mark_purchase`.

---

## 🧩 Client: files & flow

```
/index.html      landing → /quiz.html
/quiz.html       quiz + REQUIRED birth form → submit → RPC create_full_result → redirect /results.html?id={public_id}
/results.html    read id from URL, load secret from localStorage, RPC get_result → render preview + print report
/buy.html        Stripe checkout → on return, call mark_purchase(paid) → /thank-you.html?id={public_id}
/thank-you.html  show receipt + links
/assets/
  questions.json
  quiz.js
  hdcalc.js      (ephemeris + gate mapping + derivations)
  results.js
  db.js
```

---

## 💳 Stripe (MVP)

* After Checkout success → `/thank-you.html?id={public_id}` and call:

```js
await markPurchase(publicId, 'paid', {/* stripe session */});
```

* **Harden later:** Supabase Edge Function webhook to validate Stripe signature and flip `purchased=true`.

---

## ✅ Acceptance

* Submitting quiz **requires** valid birth; both quiz and chart computed; single RPC creates the record; browser redirected to results by `public_id`.
* `/results.html` loads strictly via `get_result(public_id, secret)`; direct table reads are blocked by RLS.
* Printable full report generated entirely client-side from fetched JSON.
* Purchases can be toggled via RPC (MVP) and hardened later via webhook.