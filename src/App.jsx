import { useState } from "react";

const SECTIONS = [
  { id: "stack", title: "Stack & Services", icon: "⚙️" },
  { id: "schema", title: "Database Schema", icon: "🗄️" },
  { id: "structure", title: "Project Structure", icon: "📁" },
  { id: "pipeline", title: "Data Pipeline", icon: "🔄" },
  { id: "auth", title: "Auth & Access", icon: "🔐" },
  { id: "payments", title: "Payments", icon: "💳" },
  { id: "email", title: "Daily Emails", icon: "📧" },
  { id: "mvp", title: "MVP Scope", icon: "🎯" },
  { id: "costs", title: "Cost Model", icon: "💰" },
];

function CodeBlock({ children }) {
  return (
    <pre
      style={{
        background: "#0a0a0a",
        border: "1px solid #262626",
        borderRadius: 8,
        padding: 14,
        fontSize: 11.5,
        lineHeight: 1.7,
        overflowX: "auto",
        color: "#d4d4d4",
        fontFamily: "'IBM Plex Mono', 'SF Mono', monospace",
        margin: "12px 0",
        whiteSpace: "pre",
      }}
    >
      {children}
    </pre>
  );
}

function Label({ children, color = "#737373" }) {
  return (
    <div
      style={{
        fontSize: 10,
        textTransform: "uppercase",
        letterSpacing: 1.5,
        color,
        marginBottom: 6,
        fontWeight: 600,
      }}
    >
      {children}
    </div>
  );
}

function Card({ children, highlight }) {
  return (
    <div
      style={{
        background: highlight ? "#1a1a0f" : "#111",
        border: highlight ? "1px solid #3d3d0a" : "1px solid #1f1f1f",
        borderRadius: 10,
        padding: 16,
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}

function StackSection() {
  const stack = [
    { layer: "Frontend", tech: "Next.js 15 (App Router)", why: "SSR for landing page SEO. Server components for data-heavy dashboards. Vercel deploy." },
    { layer: "Styling", tech: "Tailwind CSS + Recharts", why: "Fast UI. Recharts for all dashboard charts. No design system overhead for a solo build." },
    { layer: "Auth", tech: "Supabase Auth", why: "Email/password + Google OAuth. Built-in session management. Free tier covers 50K MAU." },
    { layer: "Database", tech: "Supabase (Postgres)", why: "Row Level Security for subscription gating. Realtime subscriptions for live data. Free tier: 500MB." },
    { layer: "Data Pipeline", tech: "Python + cron (Railway or Render)", why: "yfinance, KAPSARC API, SAMA scraping. Runs on schedule. Writes to Supabase via REST." },
    { layer: "Payments", tech: "Moyasar", why: "Saudi-first. Supports mada, Visa, MC, Apple Pay. 2.5% + 1 SAR per transaction. Recurring billing API." },
    { layer: "Email", tech: "Resend", why: "React email templates. 3K emails/month free. 100K for $20/month. API-first." },
    { layer: "Hosting", tech: "Vercel (frontend) + Railway (pipeline)", why: "Vercel free tier for Next.js. Railway $5/month for Python cron workers." },
  ];

  return (
    <div>
      {stack.map((s, i) => (
        <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: i < stack.length - 1 ? "1px solid #1a1a1a" : "none" }}>
          <div style={{ width: 90, flexShrink: 0 }}>
            <div style={{ fontSize: 10, color: "#525252", textTransform: "uppercase", letterSpacing: 1 }}>{s.layer}</div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#fafafa", marginBottom: 2 }}>{s.tech}</div>
            <div style={{ fontSize: 12, color: "#737373", lineHeight: 1.5 }}>{s.why}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SchemaSection() {
  return (
    <div>
      <Label>Core Tables</Label>
      <CodeBlock>{`-- Managed by Supabase Auth
auth.users (id, email, created_at, ...)

-- Subscription state
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) unique,
  status text check (status in (
    'active','past_due','cancelled','trialing'
  )),
  plan text default 'monthly',
  amount integer default 3000, -- halalat (30 SAR)
  moyasar_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz default now()
);

-- Single active session enforcement
create table user_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  session_token text not null,
  device_info text,
  created_at timestamptz default now(),
  unique(user_id) -- only one row per user
);

-- Email preferences
create table email_prefs (
  user_id uuid primary key references auth.users(id),
  sectors text[] default '{financial,consumer}',
  frequency text default 'daily',
  enabled boolean default true
);`}</CodeBlock>

      <Label>Market Data Tables</Label>
      <CodeBlock>{`-- Daily stock data (Tadawul)
create table stocks_daily (
  id bigserial primary key,
  symbol text not null,
  date date not null,
  open numeric, high numeric,
  low numeric, close numeric,
  volume bigint,
  market_cap numeric,
  sector text,
  unique(symbol, date)
);
create index idx_stocks_date on stocks_daily(date desc);
create index idx_stocks_sector on stocks_daily(sector);

-- TASI + sector indices
create table indices_daily (
  id bigserial primary key,
  index_name text not null,
  date date not null,
  value numeric, change_pct numeric,
  unique(index_name, date)
);

-- SAMA weekly POS transactions
create table pos_weekly (
  id bigserial primary key,
  week_ending date not null,
  city text not null,
  sector text not null,
  tx_count numeric,
  tx_value numeric, -- thousands SAR
  tx_count_change_pct numeric,
  tx_value_change_pct numeric,
  unique(week_ending, city, sector)
);

-- Macro indicators (CPI, PMI, GDP, etc)
create table macro_indicators (
  id bigserial primary key,
  indicator text not null,
  period text not null, -- '2026-Q1', '2026-02'
  value numeric,
  unit text,
  source text,
  updated_at timestamptz default now(),
  unique(indicator, period)
);

-- Real estate indices
create table realestate_index (
  id bigserial primary key,
  quarter text not null, -- '2025-Q4'
  region text,
  sector text, -- residential/commercial/agri
  property_type text,
  index_value numeric,
  change_yoy numeric,
  unique(quarter, region, sector, property_type)
);

-- News/announcements (all sectors)
create table news_items (
  id bigserial primary key,
  title text not null,
  summary text,
  source text,
  url text,
  sector text,
  published_at timestamptz,
  created_at timestamptz default now()
);`}</CodeBlock>

      <Label>Row Level Security (subscription gating)</Label>
      <CodeBlock>{`-- Public: landing page data (limited)
-- show last 7 days only for free users
create policy "free_limited_stocks"
  on stocks_daily for select using (
    date > current_date - interval '7 days'
    OR exists (
      select 1 from subscriptions
      where user_id = auth.uid()
      and status = 'active'
    )
  );

-- Full access for subscribers
create policy "subscriber_pos_data"
  on pos_weekly for select using (
    exists (
      select 1 from subscriptions
      where user_id = auth.uid()
      and status = 'active'
    )
  );

-- News is always public (drives SEO)
create policy "public_news"
  on news_items for select using (true);`}</CodeBlock>
    </div>
  );
}

function StructureSection() {
  return (
    <div>
      <Label>Next.js Project</Label>
      <CodeBlock>{`saudi-insight/
├── app/
│   ├── layout.tsx          # root layout + nav
│   ├── page.tsx            # landing page (public)
│   ├── pricing/page.tsx    # pricing + signup
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx      # auth guard + sidebar
│   │   ├── page.tsx        # overview dashboard
│   │   ├── financial/
│   │   │   ├── page.tsx    # TASI + stocks
│   │   │   └── [symbol]/page.tsx
│   │   ├── consumer/
│   │   │   └── page.tsx    # POS spending
│   │   ├── realestate/
│   │   │   └── page.tsx    # RE indices
│   │   ├── tech/
│   │   │   └── page.tsx    # news digest
│   │   └── macro/
│   │       └── page.tsx    # macro indicators
│   ├── api/
│   │   ├── webhooks/
│   │   │   └── moyasar/route.ts  # payment webhooks
│   │   └── cron/
│   │       └── trigger/route.ts  # cron trigger endpoint
│   └── account/
│       └── page.tsx        # manage subscription
├── components/
│   ├── charts/             # Recharts wrappers
│   ├── dashboard/          # sector cards, KPIs
│   ├── landing/            # hero, features, CTA
│   └── ui/                 # buttons, modals, etc
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # browser client
│   │   ├── server.ts       # server client
│   │   └── middleware.ts   # auth + subscription check
│   ├── moyasar.ts          # payment helpers
│   └── utils.ts
├── middleware.ts            # route protection
└── emails/                 # React email templates
    ├── daily-digest.tsx
    └── welcome.tsx`}</CodeBlock>

      <Label>Python Data Pipeline (separate repo)</Label>
      <CodeBlock>{`saudi-insight-pipeline/
├── pipelines/
│   ├── stocks.py       # yfinance -> supabase
│   ├── pos_data.py     # KAPSARC API -> supabase
│   ├── macro.py        # GASTAT/SAMA -> supabase
│   ├── realestate.py   # KAPSARC RE -> supabase
│   └── news.py         # RSS/scrape -> supabase
├── lib/
│   ├── supabase.py     # supabase client
│   ├── kapsarc.py      # KAPSARC API wrapper
│   └── scraper.py      # generic scraper utils
├── email/
│   └── send_digest.py  # trigger daily emails
├── schedule.py         # cron definitions
├── requirements.txt
└── Dockerfile`}</CodeBlock>

      <Label>Cron Schedule</Label>
      <CodeBlock>{`# Daily (after Tadawul close ~3:30 PM AST)
16:00 AST  stocks.py      # fetch closing prices
16:15 AST  macro.py       # check for new releases
16:30 AST  news.py        # scrape latest news
17:00 AST  send_digest.py # email subscribers

# Weekly (Saturday morning)
08:00 AST  pos_data.py    # SAMA POS weekly data

# Quarterly (manual trigger + auto-check)
08:00 AST  realestate.py  # GASTAT REPI release`}</CodeBlock>
    </div>
  );
}

function PipelineSection() {
  return (
    <div>
      <Label>Stock Data Pipeline (yfinance)</Label>
      <CodeBlock>{`# pipelines/stocks.py
import yfinance as yf
from lib.supabase import client

# All Tadawul symbols end with .SR
SYMBOLS = [
    "2222.SR",  # Aramco
    "1180.SR",  # Al Rajhi Bank
    "2010.SR",  # SABIC
    # ... full list from Tadawul
]

def fetch_daily():
    for symbol in SYMBOLS:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period="1d")
        if hist.empty:
            continue
        row = hist.iloc[-1]
        client.table("stocks_daily").upsert({
            "symbol": symbol.replace(".SR", ""),
            "date": str(hist.index[-1].date()),
            "open": float(row["Open"]),
            "high": float(row["High"]),
            "low": float(row["Low"]),
            "close": float(row["Close"]),
            "volume": int(row["Volume"]),
        }).execute()`}</CodeBlock>

      <Label>KAPSARC POS Pipeline</Label>
      <CodeBlock>{`# pipelines/pos_data.py
import requests
from lib.supabase import client

BASE = "https://datasource.kapsarc.org/api/v2"
DATASET = "point-of-sale-transactions-by-sector-and-city"

def fetch_pos_weekly():
    url = f"{BASE}/catalog/datasets/{DATASET}/records"
    params = {
        "limit": 100,
        "order_by": "date desc",
        "select": "date,city,sector,value_of_transactions,number_of_transactions"
    }
    resp = requests.get(url, params=params)
    records = resp.json()["records"]

    for r in records:
        fields = r["record"]["fields"]
        client.table("pos_weekly").upsert({
            "week_ending": fields["date"],
            "city": fields["city"],
            "sector": fields["sector"],
            "tx_value": fields.get("value_of_transactions"),
            "tx_count": fields.get("number_of_transactions"),
        }).execute()`}</CodeBlock>

      <Label>Error handling pattern</Label>
      <CodeBlock>{`# Every pipeline follows this pattern:
import logging
from datetime import datetime

def run_pipeline(name, fetch_fn):
    log = logging.getLogger(name)
    try:
        count = fetch_fn()
        log.info(f"[{name}] {count} records at "
                 f"{datetime.now().isoformat()}")
        # Write to a pipeline_runs table for monitoring
        client.table("pipeline_runs").insert({
            "pipeline": name,
            "status": "success",
            "records": count,
        }).execute()
    except Exception as e:
        log.error(f"[{name}] FAILED: {e}")
        client.table("pipeline_runs").insert({
            "pipeline": name,
            "status": "error",
            "error": str(e),
        }).execute()
        # Optional: send alert email to you`}</CodeBlock>
    </div>
  );
}

function AuthSection() {
  return (
    <div>
      <Label>Auth Flow</Label>
      <Card>
        <div style={{ fontSize: 13, color: "#d4d4d4", lineHeight: 1.8 }}>
          <strong style={{ color: "#fafafa" }}>Signup:</strong> Email/password via Supabase Auth. On signup, create row in subscriptions with status = 'trialing' (7-day free trial). Redirect to payment page.
        </div>
      </Card>
      <Card>
        <div style={{ fontSize: 13, color: "#d4d4d4", lineHeight: 1.8 }}>
          <strong style={{ color: "#fafafa" }}>Login:</strong> On login, upsert user_sessions with new session token. Previous session is overwritten. Any other active tab/device gets logged out on next request. This enforces one device per user.
        </div>
      </Card>

      <Label>Single Session Enforcement</Label>
      <CodeBlock>{`// middleware.ts
import { createServerClient } from '@supabase/ssr'

export async function middleware(req) {
  const supabase = createServerClient(...)
  const { data: { session } } = await supabase
    .auth.getSession()

  if (!session) return redirect('/login')

  // Check if this session is the active one
  const { data: activeSession } = await supabase
    .from('user_sessions')
    .select('session_token')
    .eq('user_id', session.user.id)
    .single()

  if (activeSession?.session_token
      !== session.access_token) {
    // Another device logged in - kill this session
    await supabase.auth.signOut()
    return redirect('/login?reason=other_device')
  }

  // Check subscription for dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', session.user.id)
      .single()

    if (sub?.status !== 'active'
        && sub?.status !== 'trialing') {
      return redirect('/pricing?reason=expired')
    }
  }
}`}</CodeBlock>

      <Label>What free users see vs paid</Label>
      <Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: "Landing page", free: "Full", paid: "Full" },
            { label: "TASI overview", free: "7-day delay", paid: "Real-time" },
            { label: "Stock details", free: "Locked", paid: "Full" },
            { label: "POS spending", free: "Locked", paid: "Full" },
            { label: "Real estate", free: "Locked", paid: "Full" },
            { label: "Macro dashboard", free: "Latest only", paid: "Full history" },
            { label: "News feed", free: "Full (SEO)", paid: "Full" },
            { label: "Daily email", free: "No", paid: "Yes" },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 0", borderBottom: "1px solid #1a1a1a" }}>
              <span style={{ color: "#a3a3a3" }}>{row.label}</span>
              <div style={{ display: "flex", gap: 16 }}>
                <span style={{ color: "#525252", width: 80, textAlign: "center" }}>{row.free}</span>
                <span style={{ color: "#22c55e", width: 80, textAlign: "center" }}>{row.paid}</span>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "flex-end", fontSize: 10, color: "#525252", gap: 16 }}>
            <span style={{ width: 80, textAlign: "center" }}>FREE</span>
            <span style={{ width: 80, textAlign: "center" }}>30 SAR/mo</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function PaymentsSection() {
  return (
    <div>
      <Label>Moyasar Integration</Label>
      <CodeBlock>{`// lib/moyasar.ts
const MOYASAR_API = 'https://api.moyasar.com/v1'
const SECRET_KEY = process.env.MOYASAR_SECRET_KEY

// Create a subscription (recurring payment)
export async function createSubscription(
  userId: string, email: string
) {
  const res = await fetch(
    \`\${MOYASAR_API}/invoices\`, {
    method: 'POST',
    headers: {
      'Authorization': \`Basic \${btoa(SECRET_KEY+':')}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: 3000,           // 30 SAR in halalat
      currency: 'SAR',
      description: 'Saudi Market Insight - Monthly',
      callback_url: \`\${BASE_URL}/api/webhooks/moyasar\`,
      metadata: { user_id: userId },
    }),
  })
  return res.json()
}`}</CodeBlock>

      <Label>Webhook Handler</Label>
      <CodeBlock>{`// app/api/webhooks/moyasar/route.ts
export async function POST(req: Request) {
  const body = await req.json()
  const { id, status, metadata } = body

  // Verify webhook signature (important!)

  if (status === 'paid') {
    await supabase
      .from('subscriptions')
      .upsert({
        user_id: metadata.user_id,
        status: 'active',
        moyasar_subscription_id: id,
        current_period_start: new Date(),
        current_period_end: addMonths(new Date(), 1),
      })
  }

  if (status === 'failed' || status === 'expired') {
    await supabase
      .from('subscriptions')
      .update({ status: 'past_due' })
      .eq('moyasar_subscription_id', id)
  }

  return Response.json({ received: true })
}`}</CodeBlock>

      <Label>Risk mitigation</Label>
      <Card highlight>
        <div style={{ fontSize: 12, color: "#d4d4d4", lineHeight: 1.8 }}>
          <strong style={{ color: "#fbbf24" }}>No recurring billing on day 1.</strong> Start with one-time monthly invoices via Moyasar. User pays manually each month. This avoids chargebacks, disputed recurring charges, and refund headaches. Once you hit 100+ subscribers and trust is built, switch to auto-recurring. Moyasar supports both modes.
        </div>
      </Card>
    </div>
  );
}

function EmailSection() {
  return (
    <div>
      <Label>Daily Digest Flow</Label>
      <CodeBlock>{`# email/send_digest.py
# Runs at 17:00 AST daily after all pipelines

from resend import Resend
from lib.supabase import client

resend = Resend(api_key=os.environ["RESEND_API_KEY"])

def send_daily_digests():
    # Get active subscribers with email enabled
    subs = client.table("email_prefs") \\
        .select("user_id, sectors, auth.users(email)") \\
        .eq("enabled", True) \\
        .execute()

    for sub in subs.data:
        sectors = sub["sectors"]
        digest = build_digest(sectors)

        resend.emails.send({
            "from": "insight@yourdomain.sa",
            "to": sub["users"]["email"],
            "subject": f"Saudi Market Daily | "
                       f"{date.today().strftime('%d %b')}",
            "html": render_digest_html(digest),
        })

def build_digest(sectors):
    digest = {}
    if "financial" in sectors:
        digest["tasi"] = get_tasi_summary()
        digest["top_movers"] = get_top_movers(5)
    if "consumer" in sectors:
        digest["pos"] = get_latest_pos_summary()
    if "realestate" in sectors:
        digest["re"] = get_latest_re_data()
    digest["macro"] = get_macro_highlights()
    return digest`}</CodeBlock>

      <Label>Email content structure</Label>
      <Card>
        <div style={{ fontSize: 12, color: "#d4d4d4", lineHeight: 1.8 }}>
          <strong style={{ color: "#fafafa" }}>Subject:</strong> Saudi Market Daily | 15 Apr<br/>
          <strong style={{ color: "#fafafa" }}>Section 1:</strong> TASI close, change %, 3 top gainers/losers<br/>
          <strong style={{ color: "#fafafa" }}>Section 2:</strong> Consumer spending trend (if new POS data)<br/>
          <strong style={{ color: "#fafafa" }}>Section 3:</strong> One macro highlight (CPI, PMI, etc)<br/>
          <strong style={{ color: "#fafafa" }}>Section 4:</strong> Key news headline with link<br/>
          <strong style={{ color: "#fafafa" }}>CTA:</strong> "View full dashboard" button
        </div>
      </Card>
    </div>
  );
}

function MVPSection() {
  const phases = [
    {
      phase: "Week 1-2", title: "Foundation", color: "#22c55e",
      tasks: [
        "Next.js project + Supabase setup",
        "Auth (signup/login/session enforcement)",
        "Landing page with value prop + pricing",
        "Database schema + RLS policies",
        "Moyasar one-time payment integration",
      ],
    },
    {
      phase: "Week 3-4", title: "Data + Financial Dashboard", color: "#3b82f6",
      tasks: [
        "Python pipeline: yfinance stock data",
        "Python pipeline: KAPSARC API (POS + macro)",
        "Financial markets dashboard (TASI, sectors, stock list)",
        "Macro indicators dashboard",
        "Deploy pipeline to Railway with cron",
      ],
    },
    {
      phase: "Week 5", title: "Consumer + Real Estate", color: "#8b5cf6",
      tasks: [
        "POS spending dashboard (sector x city heatmap)",
        "Real estate index dashboard",
        "Tech/startup news digest page",
        "Free vs paid data gating live",
      ],
    },
    {
      phase: "Week 6", title: "Email + Launch", color: "#f97316",
      tasks: [
        "Daily email digest with Resend",
        "Account management page",
        "Pipeline monitoring dashboard (for you)",
        "Domain + DNS + SSL",
        "Soft launch to 20-30 test users",
      ],
    },
  ];

  return (
    <div>
      <Label>6-Week Build Plan</Label>
      {phases.map((p, i) => (
        <Card key={i}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
            <span style={{ background: p.color, color: "#000", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4, textTransform: "uppercase" }}>
              {p.phase}
            </span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#fafafa" }}>{p.title}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {p.tasks.map((t, j) => (
              <div key={j} style={{ fontSize: 12, color: "#a3a3a3", paddingLeft: 12, position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "#525252" }}>-</span>
                {t}
              </div>
            ))}
          </div>
        </Card>
      ))}

      <Label color="#fbbf24">Risk avoidance checklist</Label>
      <Card highlight>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            "7-day free trial, not freemium. Trial converts or expires.",
            "Manual monthly payments first. No auto-recurring until 100+ users.",
            "Landing page + 1 sector dashboard before ads. Validate with organic/direct traffic first.",
            "No real-time data. 15-30 min delay is fine and avoids exchange licensing issues.",
            "All data aggregated and transformed. Never serve raw government data as-is.",
            "Domain: use .com not .sa (cheaper, easier, no local registrar hassle).",
            "Start ads at 500 SAR/month max. Scale only after CAC < 30 SAR confirmed.",
          ].map((item, i) => (
            <div key={i} style={{ fontSize: 12, color: "#d4d4d4", lineHeight: 1.6, paddingLeft: 18, position: "relative" }}>
              <span style={{ position: "absolute", left: 0, color: "#fbbf24" }}>{"✓"}</span>
              {item}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function CostsSection() {
  const costs = [
    { item: "Vercel (Next.js hosting)", cost: "Free", note: "Pro at $20/mo if needed" },
    { item: "Supabase (DB + Auth)", cost: "Free", note: "Pro at $25/mo after 500MB" },
    { item: "Railway (Python pipelines)", cost: "$5/mo", note: "Cron workers" },
    { item: "Resend (Email)", cost: "Free", note: "$20/mo after 3K emails" },
    { item: "Domain (.com)", cost: "$12/yr", note: "Namecheap or Cloudflare" },
    { item: "Moyasar", cost: "2.5% + 1 SAR/tx", note: "Per transaction. No monthly fee." },
  ];

  return (
    <div>
      <Label>Monthly Operating Costs at Launch</Label>
      <Card>
        {costs.map((c, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < costs.length - 1 ? "1px solid #1a1a1a" : "none", fontSize: 12 }}>
            <span style={{ color: "#d4d4d4" }}>{c.item}</span>
            <div style={{ textAlign: "right" }}>
              <span style={{ color: c.cost === "Free" ? "#22c55e" : "#fafafa", fontWeight: 600 }}>{c.cost}</span>
              <div style={{ fontSize: 10, color: "#525252" }}>{c.note}</div>
            </div>
          </div>
        ))}
      </Card>

      <Label>Total: ~$6/month to start</Label>

      <Label>Break-even math</Label>
      <Card highlight>
        <div style={{ fontSize: 12, color: "#d4d4d4", lineHeight: 1.8 }}>
          30 SAR/user/month<br/>
          Moyasar takes ~2.5% + 1 SAR = ~1.75 SAR per tx<br/>
          Net per user: ~28.25 SAR/month<br/><br/>
          <strong style={{ color: "#fafafa" }}>At 10 users:</strong> 282 SAR/mo (~$75). Covers all infra.<br/>
          <strong style={{ color: "#fafafa" }}>At 50 users:</strong> 1,412 SAR/mo (~$376). Covers infra + ads.<br/>
          <strong style={{ color: "#fafafa" }}>At 200 users:</strong> 5,650 SAR/mo (~$1,506). Real income.<br/>
          <strong style={{ color: "#fafafa" }}>At 500 users:</strong> 14,125 SAR/mo (~$3,766). Scale territory.
        </div>
      </Card>
    </div>
  );
}

const SECTION_RENDERERS = {
  stack: StackSection,
  schema: SchemaSection,
  structure: StructureSection,
  pipeline: PipelineSection,
  auth: AuthSection,
  payments: PaymentsSection,
  email: EmailSection,
  mvp: MVPSection,
  costs: CostsSection,
};

export default function App() {
  const [activeSection, setActiveSection] = useState("stack");
  const SectionContent = SECTION_RENDERERS[activeSection];

  return (
    <div
      style={{
        fontFamily: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif",
        background: "#0a0a0a",
        color: "#e5e5e5",
        minHeight: "100vh",
        padding: "24px 16px",
      }}
    >
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 3, color: "#737373", marginBottom: 6 }}>
          Technical Architecture
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "#fafafa", lineHeight: 1.2 }}>
          Saudi Market Insight
        </h1>
        <p style={{ fontSize: 12, color: "#525252", marginTop: 4 }}>
          Claude Code build reference. Every section is copy-paste ready.
        </p>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 24, flexWrap: "wrap" }}>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            style={{
              padding: "6px 10px",
              borderRadius: 6,
              border: activeSection === s.id ? "1px solid #404040" : "1px solid transparent",
              background: activeSection === s.id ? "#1a1a1a" : "transparent",
              color: activeSection === s.id ? "#fafafa" : "#525252",
              fontSize: 12,
              cursor: "pointer",
              fontWeight: activeSection === s.id ? 600 : 400,
              transition: "all 0.15s",
            }}
          >
            {s.icon} {s.title}
          </button>
        ))}
      </div>

      <SectionContent />
    </div>
  );
}
