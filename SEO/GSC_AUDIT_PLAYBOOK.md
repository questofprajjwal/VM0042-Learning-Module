# GSC Audit Playbook

**Purpose:** Reproduce the full SEO audit every 2 weeks using Claude Code + the GSC MCP server. This document describes every query, what it returns, and how to interpret the results.

**Prerequisites:**
- GSC MCP server configured in Claude Code (server name: `gsc`)
- Service account credentials at `~/.claude/sustainabilityprojects-f04745b6b223.json`
- Service account email added to Search Console with at least `siteRestrictedUser` permission
- Site property: `sc-domain:greentryst.com`

**Verification:** run `mcp__gsc__list_sites` — should return `sc-domain:greentryst.com` with `siteRestrictedUser` permission.

## 1. Overview metrics (28-day window)

**Tool:** `mcp__gsc__search_analytics`

```
siteUrl: sc-domain:greentryst.com
startDate: [28 days ago, YYYY-MM-DD]
endDate: [yesterday, YYYY-MM-DD]
```

No dimensions. Returns a single aggregated row with total clicks, impressions, average CTR, and average position for the entire site over 28 days.

**What to look for:**
- Clicks: any non-zero number is progress for a new site
- Impressions: growth trend vs prior period
- Avg position: movement toward position 10 (page 1 threshold)
- CTR: will stay near zero until pages reach top 10

**Comparison:** run the same query for the prior 28-day window (startDate 56 days ago, endDate 29 days ago) and compare side by side to see month-over-month direction.

## 2. Daily breakdown

**Tool:** `mcp__gsc__search_analytics`

```
siteUrl: sc-domain:greentryst.com
startDate: [28 days ago]
endDate: [yesterday]
dimensions: date
```

Returns one row per day with clicks, impressions, CTR, position.

**What to look for:**
- Spike days (sudden impression jumps) — usually indicate a Google re-crawl cycle or a new batch of pages entering the index
- Click days — which specific days generated clicks
- Weekend patterns — sustainability is a weekday-heavy audience, so weekend dips are normal

## 3. Top queries by impressions

**Tool:** `mcp__gsc__search_analytics` or `mcp__gsc__enhanced_search_analytics`

```
siteUrl: sc-domain:greentryst.com
startDate: [28 days ago]
endDate: [yesterday]
dimensions: query
rowLimit: 50
```

Returns up to 50 queries sorted alphabetically (GSC default). Each row includes the query string, clicks, impressions, CTR, and position.

**What to look for:**
- New queries not seen in the prior audit (these are pages Google has freshly surfaced)
- Queries with position 5 to 15 (close to page 1 — worth optimizing title/meta for)
- Queries with high impressions + zero clicks (CTR problem — title or meta description not compelling)
- Queries with position under 5 (protect these — ensure the page stays fast and content stays current)

**For a wider net:** use `enhanced_search_analytics` with `rowLimit: 200` to capture the full long tail.

**To find queries matching a specific cluster:** use `regexFilter` parameter:
```
regexFilter: (cbam|border adjustment)
```
This filters to only queries matching the regex.

## 4. Top pages by impressions and clicks

**Tool:** `mcp__gsc__search_analytics`

```
siteUrl: sc-domain:greentryst.com
startDate: [28 days ago]
endDate: [yesterday]
dimensions: page
rowLimit: 25
```

Returns up to 25 pages with clicks, impressions, CTR, position.

**What to look for:**
- Which pages are actually generating impressions (these are the pages Google considers relevant)
- Pages with position under 10 (these are on page 1 and earning real estate)
- Pages with high impressions and position 10 to 20 (candidates for title/meta rewrite or content expansion)
- New pages appearing that weren't in the prior audit (indexing is working)

## 5. Query breakdown per page (intent analysis)

For each of the top 5 pages by impressions, run a page-filtered query report to see which queries are driving traffic to that specific page:

**Tool:** `mcp__gsc__search_analytics`

```
siteUrl: sc-domain:greentryst.com
startDate: [28 days ago]
endDate: [yesterday]
dimensions: query
pageFilter: https://greentryst.com/courses/climate-science-101/1_4
filterOperator: equals
rowLimit: 20
```

Repeat for each of the top 5 pages.

**What to look for:**
- Whether the queries match the page's actual content (intent alignment)
- Queries that suggest the page should have content it currently lacks (content gaps)
- Queries that could be better served by a dedicated guide or lesson (splitting opportunity)

## 6. Country breakdown

**Tool:** `mcp__gsc__search_analytics`

```
siteUrl: sc-domain:greentryst.com
startDate: [28 days ago]
endDate: [yesterday]
dimensions: country
rowLimit: 15
```

Returns ISO 3166-1 alpha-3 country codes with clicks, impressions, CTR, position.

**Country code reference:** IND = India, USA = United States, GBR = United Kingdom, CAN = Canada, BRA = Brazil, DEU = Germany, AUS = Australia, FRA = France, BEL = Belgium, CHE = Switzerland, NLD = Netherlands.

**What to look for:**
- Geographic concentration (where is the audience actually coming from)
- Position differences by country (you may rank page 1 in one country and page 3 in another for the same content)
- Emerging markets showing up (validates geographic strategy decisions)

## 7. Device breakdown

**Tool:** `mcp__gsc__search_analytics`

```
siteUrl: sc-domain:greentryst.com
startDate: [28 days ago]
endDate: [yesterday]
dimensions: device
```

Returns DESKTOP, MOBILE, TABLET rows.

**What to look for:**
- Mobile vs desktop position gap — a large gap (e.g. desktop pos 15, mobile pos 44) indicates mobile rendering or Core Web Vitals issues
- Device share — sustainability is desktop-heavy but mobile share should grow over time

## 8. Quick wins detection

**Tool:** `mcp__gsc__detect_quick_wins`

```
siteUrl: sc-domain:greentryst.com
startDate: [28 days ago]
endDate: [yesterday]
minImpressions: 10
maxCtr: 5
positionRangeMin: 4
positionRangeMax: 15
```

Automatically identifies queries with high impressions, low CTR, and positions near page 1.

**Note:** This tool returns empty when no single query has enough impressions to cross the threshold. For a new site, lower `minImpressions` to 5 or even 3 to catch early signals.

## 9. URL inspection (indexing status)

**Tool:** `mcp__gsc__index_inspect`

```
siteUrl: sc-domain:greentryst.com
inspectionUrl: https://greentryst.com/guides/cbam-2026-definitive-regime
```

Returns indexing verdict, coverage state, robots.txt status, page fetch status, canonical URL (both user-declared and Google-selected), last crawl time, rich results validation status.

**When to use:**
- After publishing a new page — check if it's been discovered and indexed
- When a page's impressions suddenly drop — check if Google has de-indexed it
- When structured data seems broken — the rich results section flags missing fields

**Key verdicts:**
- `PASS` + "Submitted and indexed" — everything is working
- `NEUTRAL` + "Discovered - currently not indexed" — Google knows the URL exists (from sitemap) but hasn't crawled it yet. Normal for new pages. Request indexing manually.
- `FAIL` + "Crawled - currently not indexed" — Google crawled it but decided not to index. Usually means thin content, duplicate content, or noindex tag.
- `FAIL` + "Excluded by robots.txt" — the page is blocked from crawling

**Rich results section:** shows detected structured data types (BreadcrumbList, FAQPage, etc.) and any validation errors. "Missing field X" means the JSON-LD is malformed.

**Run this for:**
- Every newly published guide or page within 48 hours of publishing
- Top 5 pages by impressions once per audit (to catch any indexing regressions)
- Homepage every audit (to verify canonical is still correct)

## 10. Sitemaps

**Tool:** `mcp__gsc__list_sitemaps`

```
siteUrl: sc-domain:greentryst.com
```

Returns all submitted sitemaps with their status, last downloaded date, URL count, indexed count, warnings, and errors.

**What to look for:**
- `errors: "0"` and `warnings: "0"` — sitemap is healthy
- `submitted` vs `indexed` count — a large gap means many URLs are submitted but not indexed
- `lastDownloaded` date — if stale (more than 7 days), Google may not be re-checking for new pages

## Full audit template prompt

Copy and paste this into Claude Code to run the complete audit in one shot:

```
Run a GSC audit for greentryst.com. Today is [DATE]. Pull the following using `mcp__gsc__*` tools:

1. Overview metrics: last 28 days (startDate [28d ago] to endDate [yesterday]) and prior 28 days for comparison
2. Daily breakdown (dimensions: date) for last 28 days
3. Top 50 queries by impressions (dimensions: query, rowLimit: 50) for last 28 days
4. Top 25 pages (dimensions: page, rowLimit: 25) for last 28 days
5. Country breakdown (dimensions: country, rowLimit: 15)
6. Device breakdown (dimensions: device)
7. Quick wins (detect_quick_wins with minImpressions: 5, positionRangeMin: 4, positionRangeMax: 15)
8. Sitemaps status (list_sitemaps)
9. Index inspection for: homepage, CBAM guide, and top 3 pages by impressions

Compare the overview metrics against the prior 28-day window. Flag:
- New queries not seen in the last audit
- Pages that moved into or out of positions 1-10
- Any indexing issues
- CTR anomalies (high impressions + zero clicks)

Produce a summary with: what improved, what worsened, what's new, and 3 concrete actions for the next 2 weeks.
```

## Audit schedule

- **Every 2 weeks:** full audit using the template above
- **Within 48 hours of publishing any new page:** run `index_inspect` on that URL to check discovery and indexing status
- **Monthly:** compare the 3-month window to the prior 3-month window for trend analysis
- **Quarterly:** pull full 3-month data with `rowLimit: 500` on queries and pages for a deep keyword bank refresh

## File locations

- Audit results: save each audit as `SEO/audits/YYYY-MM-DD.md`
- Keyword bank (enriched): `SEO/KeywordPlanning/KEYWORD_BANK_ENRICHED.xlsx`
- SEO plan: `brainstorming/SEO_PLAN_APRIL_2026.md`
- Tool opportunities: `SEO/KeywordPlanning/TOOL_OPPORTUNITIES.md`
- Emission factors spec: `brainstorming/EMISSION_FACTORS_PRODUCT_SPEC.md`
