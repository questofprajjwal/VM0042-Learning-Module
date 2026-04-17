# GA4 Audit Playbook

**Purpose:** Reproduce the full Google Analytics 4 audit every 2 weeks using the GA4 Data API directly via service account credentials. Runs alongside the GSC audit, no MCP required.

**GSC vs GA:** GSC tells you what Google Search sees (impressions, positions, clicks from organic search only). GA tells you what visitors actually do on the site from **every** channel (direct, LinkedIn, Reddit, AI referrers, organic search). Always run both — they are complements, not substitutes.

## Prerequisites

- Service account credentials: `/Users/knowprajjwal/.claude/sustainabilityprojects-f04745b6b223.json`
- Service account email: `gsc-mcp-reader@sustainabilityprojects.iam.gserviceaccount.com`
- GA4 Property ID: **`527198684`** (Property name: "SustAcad")
- Service account must have **Viewer** role on the GA4 property (Admin → Property access management)
- Two Google Cloud APIs must be enabled in project `sustainabilityprojects`:
  - Google Analytics Admin API (for property discovery)
  - Google Analytics Data API (for metrics)
- Python package: `google-auth`, `requests`

## Python boilerplate

Every GA query starts with this token-fetching block:

```python
from google.oauth2 import service_account
from google.auth.transport.requests import Request
import requests, json

creds = service_account.Credentials.from_service_account_file(
    '/Users/knowprajjwal/.claude/sustainabilityprojects-f04745b6b223.json',
    scopes=['https://www.googleapis.com/auth/analytics.readonly']
)
creds.refresh(Request())

PROPERTY = "527198684"
HEADERS = {'Authorization': f'Bearer {creds.token}', 'Content-Type': 'application/json'}
URL = f'https://analyticsdata.googleapis.com/v1beta/properties/{PROPERTY}:runReport'
```

All subsequent queries POST to that URL with a JSON body.

## 1. Overview metrics (28-day window)

```python
body = {
    "dateRanges": [{"startDate": "28daysAgo", "endDate": "yesterday"}],
    "metrics": [
        {"name": "activeUsers"},
        {"name": "sessions"},
        {"name": "screenPageViews"},
        {"name": "averageSessionDuration"},
        {"name": "bounceRate"},
        {"name": "engagementRate"}
    ]
}
```

Returns one row with six totals for the window.

**What to look for:**
- `activeUsers` — real humans who visited (not impressions)
- `sessions` — visit sessions
- `screenPageViews` — total page loads
- `averageSessionDuration` — in seconds. Greater than 120 = good. Greater than 300 = very engaged.
- `bounceRate` — under 40% = good, over 60% = content/landing problem
- `engagementRate` — sessions where user did something meaningful. Over 50% = good.

**Compare to GSC for the same window.** If GSC shows 1 click and GA shows 828 sessions, your traffic is almost entirely non-search (distribution, direct, referral).

## 2. Daily breakdown

```python
body = {
    "dateRanges": [{"startDate": "28daysAgo", "endDate": "yesterday"}],
    "dimensions": [{"name": "date"}],
    "metrics": [{"name": "activeUsers"}, {"name": "sessions"}, {"name": "screenPageViews"}],
    "orderBys": [{"dimension": {"dimensionName": "date"}}]
}
```

**What to look for:**
- Traffic spike days — cross-reference against LinkedIn posts, HN submissions, newsletter sends
- Weekend vs weekday pattern — sustainability audiences are weekday-heavy
- Sudden drops — possible tracking issue or lost backlink

## 3. Traffic sources (the crucial GA-only view)

```python
body = {
    "dateRanges": [{"startDate": "28daysAgo", "endDate": "yesterday"}],
    "dimensions": [
        {"name": "sessionDefaultChannelGroup"},
        {"name": "sessionSource"}
    ],
    "metrics": [{"name": "sessions"}, {"name": "activeUsers"}],
    "orderBys": [{"metric": {"metricName": "sessions"}, "desc": True}],
    "limit": 25
}
```

Returns source-by-source breakdown: Direct, Organic Search, Organic Social (LinkedIn, Reddit), Referral, Paid, etc.

**What to look for:**
- **Distribution health** — LinkedIn, Twitter, Reddit sessions grow when you post, decay when you don't
- **AI referrers** — `perplexity.ai`, `chatgpt.com`, `claude.ai`, `gemini.google.com`. These signal LLM citations. Will grow over time as LLMs surface your content.
- **Organic search health** — `google` / `bing` sessions. Compare trend against GSC clicks.
- **Accidental traffic** — random subdomains (vercel preview URLs, staging deploys) leaking to users means a link somewhere points to the wrong environment.

**GSC blind spot this fills:** GSC has zero visibility into LinkedIn, Reddit, Perplexity, ChatGPT, or direct traffic. You could be doing great on those channels and look dead in GSC.

## 4. Top pages

```python
body = {
    "dateRanges": [{"startDate": "28daysAgo", "endDate": "yesterday"}],
    "dimensions": [{"name": "pagePath"}],
    "metrics": [
        {"name": "activeUsers"},
        {"name": "screenPageViews"},
        {"name": "averageSessionDuration"},
        {"name": "engagementRate"}
    ],
    "orderBys": [{"metric": {"metricName": "screenPageViews"}, "desc": True}],
    "limit": 20
}
```

**What to look for:**
- **High views + long duration** — content that works. Do more.
- **High views + short duration + high bounce** — landing problem. Headline or opening paragraph fails.
- **Low views + long duration** — hidden gems. Surface them in navigation.
- **Redesign paths showing up** — `/redesign/*` leaking to production means navigation accidentally points there.

## 5. Country breakdown

```python
body = {
    "dateRanges": [{"startDate": "28daysAgo", "endDate": "yesterday"}],
    "dimensions": [{"name": "country"}],
    "metrics": [{"name": "activeUsers"}, {"name": "sessions"}],
    "orderBys": [{"metric": {"metricName": "activeUsers"}, "desc": True}],
    "limit": 15
}
```

Returns human-readable country names (not ISO codes like GSC uses).

**What to look for:**
- Dominant market — where should localization, pricing, and examples target?
- Emerging markets — where is the audience growing fastest?
- Compare vs GSC country data — GA shows real visitors, GSC shows impressions. Gaps reveal which countries convert impressions best.

## 6. Device breakdown

```python
body = {
    "dateRanges": [{"startDate": "28daysAgo", "endDate": "yesterday"}],
    "dimensions": [{"name": "deviceCategory"}],
    "metrics": [
        {"name": "activeUsers"},
        {"name": "sessions"},
        {"name": "engagementRate"},
        {"name": "averageSessionDuration"}
    ]
}
```

**What to look for:**
- Mobile vs desktop user share — GA shows real visitors, GSC shows impressions. They often diverge.
- Engagement rate per device — if mobile engagement is meaningfully lower than desktop, UX problem.

## 7. Landing pages (entry points)

```python
body = {
    "dateRanges": [{"startDate": "28daysAgo", "endDate": "yesterday"}],
    "dimensions": [{"name": "landingPage"}],
    "metrics": [
        {"name": "sessions"},
        {"name": "activeUsers"},
        {"name": "bounceRate"},
        {"name": "averageSessionDuration"}
    ],
    "orderBys": [{"metric": {"metricName": "sessions"}, "desc": True}],
    "limit": 20
}
```

Different from "top pages." Landing pages are where users **arrive** on the site. High bounce rate on a landing page is a much bigger problem than high bounce rate on a deep page.

## 8. Source + landing page combo (full funnel visibility)

```python
body = {
    "dateRanges": [{"startDate": "28daysAgo", "endDate": "yesterday"}],
    "dimensions": [
        {"name": "sessionSource"},
        {"name": "landingPage"}
    ],
    "metrics": [
        {"name": "sessions"},
        {"name": "activeUsers"},
        {"name": "engagementRate"}
    ],
    "orderBys": [{"metric": {"metricName": "sessions"}, "desc": True}],
    "limit": 30
}
```

**What to look for:**
- Which LinkedIn posts sent traffic to which pages
- Which AI referrers cite which pages
- Distribution ROI by channel per page

## 9. Events (conversion tracking)

```python
body = {
    "dateRanges": [{"startDate": "28daysAgo", "endDate": "yesterday"}],
    "dimensions": [{"name": "eventName"}],
    "metrics": [{"name": "eventCount"}, {"name": "activeUsers"}],
    "orderBys": [{"metric": {"metricName": "eventCount"}, "desc": True}],
    "limit": 20
}
```

GA4 default events: `page_view`, `scroll`, `click`, `user_engagement`, `session_start`, `first_visit`. Custom events if you instrument them: `signup_complete`, `course_start`, `lesson_complete`, `tool_used`, `pdf_download`, `copy_citation`.

**What to look for:**
- Funnel conversion — what fraction of `page_view` → `signup_complete`
- Tool usage events — is anyone actually using the tools
- Drop-off points — where events stop happening in a sequence

## 10. Comparison against GSC

After running both audits, answer the Venn diagram:

- **Visitors from Google Search (GSC ∩ GA):** GA `sessionSource = google` users. Should roughly match GSC clicks.
- **Visitors NOT from Google Search (GA only):** every non-google source in GA. This is the traffic GSC cannot see. Distribution, direct, referrers, AI citations.
- **Impressions NOT converting (GSC only):** GSC impressions with no corresponding GA session. These are search impressions where the user didn't click.

A healthy site early in life has: GA sessions far greater than GSC clicks (distribution is carrying you), with GSC impressions growing (Google is starting to notice).

## Full GA audit script template

Save this as `scripts/ga-audit.py` and run it to dump everything at once:

```python
#!/usr/bin/env python3
from google.oauth2 import service_account
from google.auth.transport.requests import Request
import requests, json, sys

creds = service_account.Credentials.from_service_account_file(
    '/Users/knowprajjwal/.claude/sustainabilityprojects-f04745b6b223.json',
    scopes=['https://www.googleapis.com/auth/analytics.readonly']
)
creds.refresh(Request())

PROPERTY = "527198684"
HEADERS = {'Authorization': f'Bearer {creds.token}', 'Content-Type': 'application/json'}
URL = f'https://analyticsdata.googleapis.com/v1beta/properties/{PROPERTY}:runReport'

def run(body, label):
    r = requests.post(URL, headers=HEADERS, json=body)
    print(f"\n=== {label} ===")
    if r.status_code != 200:
        print(f"ERROR {r.status_code}: {r.text}")
        return None
    return r.json()

queries = [
    ("Overview 28d", {
        "dateRanges": [{"startDate": "28daysAgo", "endDate": "yesterday"}],
        "metrics": [{"name": m} for m in [
            "activeUsers", "sessions", "screenPageViews",
            "averageSessionDuration", "bounceRate", "engagementRate"
        ]]
    }),
    ("Daily", {
        "dateRanges": [{"startDate": "28daysAgo", "endDate": "yesterday"}],
        "dimensions": [{"name": "date"}],
        "metrics": [{"name": m} for m in ["activeUsers", "sessions", "screenPageViews"]],
        "orderBys": [{"dimension": {"dimensionName": "date"}}]
    }),
    ("Traffic Sources", {
        "dateRanges": [{"startDate": "28daysAgo", "endDate": "yesterday"}],
        "dimensions": [{"name": "sessionDefaultChannelGroup"}, {"name": "sessionSource"}],
        "metrics": [{"name": "sessions"}, {"name": "activeUsers"}],
        "orderBys": [{"metric": {"metricName": "sessions"}, "desc": True}],
        "limit": 25
    }),
    ("Top Pages", {
        "dateRanges": [{"startDate": "28daysAgo", "endDate": "yesterday"}],
        "dimensions": [{"name": "pagePath"}],
        "metrics": [{"name": m} for m in ["activeUsers", "screenPageViews", "averageSessionDuration", "engagementRate"]],
        "orderBys": [{"metric": {"metricName": "screenPageViews"}, "desc": True}],
        "limit": 20
    }),
    ("Landing Pages", {
        "dateRanges": [{"startDate": "28daysAgo", "endDate": "yesterday"}],
        "dimensions": [{"name": "landingPage"}],
        "metrics": [{"name": m} for m in ["sessions", "activeUsers", "bounceRate", "averageSessionDuration"]],
        "orderBys": [{"metric": {"metricName": "sessions"}, "desc": True}],
        "limit": 20
    }),
    ("Country", {
        "dateRanges": [{"startDate": "28daysAgo", "endDate": "yesterday"}],
        "dimensions": [{"name": "country"}],
        "metrics": [{"name": "activeUsers"}, {"name": "sessions"}],
        "orderBys": [{"metric": {"metricName": "activeUsers"}, "desc": True}],
        "limit": 15
    }),
    ("Device", {
        "dateRanges": [{"startDate": "28daysAgo", "endDate": "yesterday"}],
        "dimensions": [{"name": "deviceCategory"}],
        "metrics": [{"name": m} for m in ["activeUsers", "sessions", "engagementRate", "averageSessionDuration"]]
    }),
    ("Events", {
        "dateRanges": [{"startDate": "28daysAgo", "endDate": "yesterday"}],
        "dimensions": [{"name": "eventName"}],
        "metrics": [{"name": "eventCount"}, {"name": "activeUsers"}],
        "orderBys": [{"metric": {"metricName": "eventCount"}, "desc": True}],
        "limit": 15
    }),
]

all_data = {}
for label, body in queries:
    all_data[label] = run(body, label)

# Dump to JSON for downstream analysis
out_path = f"SEO/audits/ga-{__import__('datetime').date.today().isoformat()}.json"
import os
os.makedirs("SEO/audits", exist_ok=True)
with open(out_path, "w") as f:
    json.dump(all_data, f, indent=2)
print(f"\nSaved: {out_path}")
```

Run with: `python3 scripts/ga-audit.py`

## Full audit template prompt (GA + GSC combined)

Use this in Claude Code every 2 weeks:

```
Run the combined GSC + GA audit for greentryst.com. Today is [DATE].

GSC (via mcp__gsc__*):
1. Overview 28d and prior 28d
2. Daily breakdown
3. Top 50 queries
4. Top 25 pages
5. Country + device
6. Index-inspect top 5 pages + any new guides from last 2 weeks

GA4 (via GA4 Data API, property 527198684):
1. Overview 28d and prior 28d (sessions, users, engagement)
2. Daily sessions
3. Traffic sources (channel + source)
4. Top 20 pages by pageviews
5. Top 20 landing pages
6. Country + device
7. Event counts

Produce a combined summary with:
- Distribution vs search ratio (GA sessions vs GSC clicks)
- Which channels are carrying traffic this period
- Which pages are hits across both data sources
- Which GSC impressions are NOT converting (high imp, 0 clicks, high position)
- Which GA-only traffic needs GSC attention (page getting visits but 0 search impressions)
- 3 concrete actions for the next 2 weeks
```

## Audit schedule

- **Every 2 weeks:** combined GA + GSC audit
- **After every distribution push** (LinkedIn post, HN submission, newsletter): check GA daily and source data within 72 hours to measure impact
- **After every new page ships:** check GA within 7 days for initial page-view trajectory
- **Monthly:** compare 3-month window to prior 3-month window
- **Quarterly:** full audit with expanded row limits (500+) for keyword bank and page bank refreshes

## File locations

- GA audit dumps: `SEO/audits/ga-YYYY-MM-DD.json`
- GSC audit dumps: `SEO/audits/gsc-YYYY-MM-DD.md`
- Combined audit summary: `SEO/audits/combined-YYYY-MM-DD.md`
- Playbooks: `SEO/GSC_AUDIT_PLAYBOOK.md`, `SEO/GA_AUDIT_PLAYBOOK.md` (this file)

## When the API fails

**403 SERVICE_DISABLED:** the two APIs (Analytics Admin + Data) are not enabled in the GCP project. Enable via the URLs in the error message and wait 1-2 minutes.

**403 PERMISSION_DENIED:** service account is not granted Viewer access on the GA4 property. Re-check Admin → Property access management.

**401:** token expired. The boilerplate refreshes it automatically, but if calling outside Python, you need to fetch a fresh token.

**429:** rate limit. GA4 Data API allows 25,000 tokens/day per property at the Standard tier. For bi-weekly audits this is never a problem.

## One-off useful queries

### Compare last 7 days vs prior 7 days
```python
"dateRanges": [
    {"startDate": "7daysAgo", "endDate": "yesterday", "name": "current"},
    {"startDate": "14daysAgo", "endDate": "8daysAgo", "name": "prior"}
]
```

### Find pages with best engagement (for scaling up)
```python
"dimensions": [{"name": "pagePath"}],
"metrics": [{"name": "engagementRate"}, {"name": "screenPageViews"}],
"metricFilter": {
    "filter": {
        "fieldName": "screenPageViews",
        "numericFilter": {"operation": "GREATER_THAN", "value": {"int64Value": 20}}
    }
},
"orderBys": [{"metric": {"metricName": "engagementRate"}, "desc": True}]
```

### Track a specific page over time
```python
"dateRanges": [{"startDate": "90daysAgo", "endDate": "yesterday"}],
"dimensions": [{"name": "date"}],
"metrics": [{"name": "screenPageViews"}, {"name": "activeUsers"}],
"dimensionFilter": {
    "filter": {
        "fieldName": "pagePath",
        "stringFilter": {"matchType": "EXACT", "value": "/guides/cbam-2026-definitive-regime"}
    }
}
```
