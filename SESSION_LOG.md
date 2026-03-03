# VM0042 Learning Module — Session Log

**Project:** VM0042 v2.2 Interactive Learning Module
**Repo:** https://github.com/questofprajjwal/sustainabilityacademy
**Live URL:** https://sa-gray-tau.vercel.app
**Dedicated to:** Muskan 💚

---

## What Was Built

A single-file interactive web-based learning course (`index.html`) built with React 18 + Tailwind CSS (CDN), covering Verra's VM0042 v2.2 "Improved Agricultural Land Management" methodology in full — plus the three supporting VCS methodology documents. The course is designed for non-experts and practitioners alike, with plain-language explanations, real-world analogies, worked calculations, and interactive quizzes throughout.

**Current Structure:** 10 Modules + Capstone | 33 Lessons | ~55+ hours of content | 110+ quiz questions

---

## Module Structure

| Module | Title | Lessons | Color |
|--------|-------|---------|-------|
| 0 | Foundations: Carbon, Climate & Agriculture | 0.1, 0.2, 0.3 | Green |
| 1 | Introduction to VM0042 | 1.1, 1.2, 1.3, 1.4 | Emerald |
| 2 | Project Boundary, Baseline & Additionality | 2.1, 2.2, 2.3, 2.4 | Teal |
| 3 | Quantification: Measuring & Calculating Carbon | 3.1, 3.2, 3.3, 3.4, 3.5 | Blue |
| 4 | Uncertainty & VCU Calculation | 4.1, 4.2, 4.3, 4.4 | Violet |
| 5 | Monitoring, Verification & Implementation | 5.1, 5.2, 5.3, 5.4 | Orange |
| 6 | VCS Registration & Lifecycle | 6.1, 6.2 | Indigo |
| 7 | Additionality in Depth (VT0008) | 7.1, 7.2 | Purple |
| 8 | Model Calibration & Validation (VMD0053) | 8.1, 8.2 | Cyan |
| 9 | Non-Permanence Risk (AFOLU Buffer Tool) | 9.1, 9.2 | Rose |
| CAP | Capstone Project (India — Madhya Pradesh) | — | Red |

---

## Session-by-Session Work Done

### Phase 1 — Initial Build (earlier sessions)
- Created full HTML shell with React + Tailwind + CDN imports
- Built sidebar navigation, progress tracking (localStorage), responsive layout
- Populated Modules 0–4 with full lesson content
- Module 5 and Capstone were placeholder stubs

### Phase 2 — Content Completion (earlier sessions)
- Added Module 5 lessons: 5.1 Monitoring Plan Design, 5.2 Verification Process, 5.3 Emerging Technologies, 5.4 Navigating the Appendices
- Added Capstone Project: 8,000 ha cooperative in Madhya Pradesh, India; 10 deliverables with graded rubric
- Ran content review with Gemini and Codex CLIs; fixed 7 factual errors

### Phase 3 — Depth Additions (earlier sessions)
Five lessons received substantial new content:

**Lesson 3.2 (SOC Measurement)** — Added Equivalent Soil Mass (ESM) calculation section:
- Reference mass formula: `M_ref = BD_baseline × D_std × 10,000`
- ESM-corrected depth formula: `D_ESM = M_ref / (BD_project × 10,000)`
- Worked example: BD 1.30→1.25, naive SOC = 78.75 tC/ha, ESM-corrected = 81.9 tC/ha (4% difference)
- Coarse fragment correction formula

**Lesson 3.3 (Baseline & Project Emissions)** — Added two new subsections:
- *Soil Methanogenesis CH₄*: Full IPCC rice paddy formula with SF_w, SF_s, SF_p scaling factors; Vietnam AWD example showing 4.37→2.27 tCO₂e/ha/season (48% reduction)
- *Manure Deposition*: Both CH₄ and N₂O formulas; EF3 = 0.02 for pastures; Argentina grazing example

**Lesson 4.2 (Error Propagation & Monte Carlo)** — Clarified VM0042's probability-of-exceedance construct:
- Uses 95% confidence lower bound (not 90%)
- 1.645σ for normal distributions; non-symmetric distributions require Monte Carlo
- Full deduction schedule: <15%→0%, 15–20%→5%, 20–30%→15%, >30%→35%

**Lesson 4.4 (Economics & Decision-Making)** — Added two new sections:
- *Timeline to First Credits*: 8-row table from scoping (month 0) through VCU deposit (~month 24–36)
- *VCM Market Dynamics*: Price history table 2018–2025; premium/discount factor grid (co-benefits, project scale, vintage, buyer type)

**Lesson 5.2 (Verification Process)** — Added validation vs. verification distinction:
- Side-by-side panel: validation (before project start, reviews PDD) vs. verification (after monitoring, audits data)
- VCS two-body independence rule: different VVBs required for validation and first verification
- New quiz question added

### Phase 4 — VCS Registration Module (Module 6, earlier sessions)
Read three PDFs from `/Verra/VCS/`:
- `Registration-and-Issuance-Process-v5.0.pdf` (Dec 2025)
- `VCS-Program-Guide-v5.0.pdf` (Dec 2025)
- `Clarification-Verra-Program-Fee-Schedule-April-2025.pdf`

Created two new lessons:

**Lesson 6.1 — The Registration Journey: Pipeline to First VCUs**
- Registry account setup (Verra Registry, Markit Environmental Registry)
- Pipeline listing: "under development" vs "under validation", required documents, $1,500 fee, 30-day public comment
- Steps 1–4 of the VCS registration process; document package: 13 required items
- Fees: $3,750 registration review + $5,000 verification review; 3-round review process
- VCU serial number generation and labeling; Kenya maize project timeline worked example; 4 quiz questions

**Lesson 6.2 — VCU Lifecycle: Retirement, Buffer & Ongoing Obligations**
- Step 5: Periodic issuance (5-year maximum gap, "late-to-verify" status)
- Step 6: Retirement vs. cancellation distinction (concert ticket analogy)
- AFOLU Non-Permanence Risk / Buffer Pool mechanics; buffer worked example (10,000 tCO₂e net, 17% buffer = 1,700 buffer credits, 8,300 VCUs issued)
- 9 VCU attributes from VCS Program Guide Table 3; Step 7: project maintenance, QA/QC, Verra audit rights; 4 quiz questions

### Phase 5 — Git & Deployment (earlier sessions)
- Initialized git repo in `/Users/knowprajjwal/Verra/`
- Created GitHub repo via `gh repo create questofprajjwal/sustainabilityacademy --public`
- Installed Vercel CLI; fixed npm cache ownership issue
- Fixed 404 (entry point was `VM0042_Learning_Module.html` not `index.html`) by copying to `index.html`
- Final live URL: **https://sa-gray-tau.vercel.app**

### Phase 6 — Footer (earlier sessions)
Added footer at bottom of page:
> *Made with 💚 for Muskan — who probably still won't read it 😄*

---

### Phase 7 — Three New Methodology Modules (current session)

Read all three new PDFs from `/Verra/VCS/`:
- `VMD0053v2.1_BIOGEOCHEMICAL_MODEL_CALIBRATION_VALIDATION_AND_UNCERTAINTY_GUIDANCE_FOR_ALM_clean.pdf`
- `VT0008-Additionality-Assessment-v1.0.pdf`
- `AFOLU-Non-Permanence-Risk-Tool-v4.2-last-updated-May-3-2024.pdf`

Added **3 new modules, 6 lessons, 24 quiz questions**:

#### Module 7 — Additionality in Depth (VT0008 v1.0, Oct 2024)

**Lesson 7.1 — VT0008: The Four-Step Additionality Framework**
- Master decision tree: Step 1 (alternatives) → Step 2 or 3 → Step 4
- Step 1: three mandatory alternative scenarios; applicable geographic area definition; legality screen (high-income countries vs others)
- Step 2: barrier analysis — financial, information, and institutional barrier types (with "unless methodology specifies" caveat); Steps 2a–2d with India maize worked example; evidence quality requirements (Appendix 1)
- LDC/SIDS/LIC simplified barrier approach callout
- Regulatory surplus vs additionality distinction

**Lesson 7.2 — Investment Analysis & Common Practice (Steps 3–4)**
- Two options: Investment Comparison Analysis (any financial indicator) and Benchmark Analysis (IRR only)
- WACC formula: `WACC = r_e × W_e + r_d × (1 − T_c) × W_d`
- CAPM formula: `r_e = r_f + β × (r_m − r_f)` with five applicability conditions
- Default cost of equity (real terms): 3.1% risk-free + 2.7% equity risk premium + country risk premium; sector adjustments (Group 1/2/3)
- Vietnam rice AWD example corrected to Group 3 AFOLU rate: r_e = 9.87%, WACC = 7.31%
- Excel spreadsheet requirements including commercially sensitive info exception; depreciation treatment (non-cash, added back)
- Step 4 common practice: Factor F formula, ±50% capacity/output range, VCS+non-VCS identification, F>20% AND N_all−N_diff>3 threshold

#### Module 8 — Model Calibration & Validation (VMD0053 v2.1)

**Lesson 8.1 — Model Eligibility, Calibration & the Project Domain**
- Four eligibility criteria: publicly available docs, peer-reviewed, reproducible (version control, random seed), validated per module
- PC/CFG/ES combination system: six Practice Categories (Table 1) with Domain of Practice Effects; six CFG attributes; three Emission Sources (SOC, N₂O, CH₄)
- Worked example: Maharashtra project → 5 distinct PC/CFG/ES combinations to validate
- Calibration: frequentist vs Bayesian approaches; same parameters used in calibration, validation, and project simulations; parameters at no finer than one IPCC climate zone
- Project domain definition: CFGs + climate zones + soil textures + clay content (≥15 percentage point span required)
- Substitution hierarchy: same-CFG first, then different-CFG (conservative direction in both baseline and project)
- Domain exception pathway: petition allowed with IME/VVB approval

**Lesson 8.2 — Bias Tests, Prediction Error & the MVR**
- Bias formula (Eq 1): `bias = Σ(P_i − O_i) / n` per study; unweighted mean across studies (why unweighted: prevents large studies from dominating)
- PMU formula (Eq 2): pooled standard error weighted by degrees of freedom
- Bias validity test: `|mean bias| ≤ PMU`
- Model prediction error variance; 90% prediction interval formula: `[μ_i − 1.64σ_model, μ_i + 1.64σ_model]`
- Confidence coverage test: ≥90% of validation data within 90% PI
- Prediction interval vs confidence interval distinction explained
- Option A (analytical) vs Option B (Monte Carlo / PPDs) for prediction error
- Petitions for exceptions: bias >PMU or coverage <90% not necessarily fatal where data scarcity documented
- Default PMU values when standard errors not published; NAPT as reference
- MVR content requirements; IME qualifications (≥5 years, peer-reviewed publications, 2 references, no conflict of interest)
- Peer-reviewed journal pathway + required sub-report
- MVR submitted with each monitoring report; update triggers

#### Module 9 — Non-Permanence Risk (AFOLU Buffer Tool v4.2, May 2024)

**Lesson 9.1 — Internal & External Risk Scoring**
- Three-category framework: Internal (PM, FV, OC, PL) + External (LT, SE, PC) + Natural
- Critical rules: any FAIL = ineligible; 12% minimum buffer floor; category ceilings (Internal>35, External>20, Natural>35); overall FAIL if >60%
- PM table: adaptive management plan gateway; ALM-specific factors (+2 each for untrained farmers, unaware of yield transition); mitigation: −2 for experienced team, −2 for comprehensive training plan
- FV table: payback period scoring (FAIL if >20 years); funding secured scoring; callable resources mitigation
- OC table: NPV comparison scores (+8 to −4); subsistence baseline alternative; legal agreement mitigations (−2 for crediting period, −4 for 100 years)
- PL formula: `25 − (longevity/5)` without legal agreement; `25 − (longevity/4)` with legal agreement; longevity ≥40 years required for projects registered ≥1 Jan 2024
- LT table: FAIL gateways (no due process, no binding legal agreement); government expropriation history scores; tenure and access dispute scores; WRC upstream/sea-impact factor (+5/0); max 37 points
- SE table: "more than 50%" (not ≥50%) within-project; "more than 20%" (not ≥20%) outside 20km
- PC table: World Bank WGI 6-indicator mean; Paris Agreement/NDC/AFOLU mitigation (−2)
- Kenya Rift Valley worked example: Internal = 17, External = 2

**Lesson 9.2 — Natural Risks, Climate Change Impact & Final Buffer**
- LS scoring from Table 10: Likelihood × Significance matrix (Catastrophic ≥70% × >once/10yr = FAIL; correctly expressed as "50% to <70%", "25% to <50%", "5% to <25%")
- Mitigation M values: 0.50 (one mitigation), 0.25 (both), 1.00 (none); mitigation examples per risk factor
- Climate change CID amplification factor (1.0–1.4); formula: `Total NR = NR-c × CID_factor + NR-nc + SLR`
- Adaptive capacity 7 criteria (Table 12): if ≥5 met, amplification fraction reduced 40%
- SLR scoring table and adaptation multipliers (EbA: 0.50; protection barriers: 0.60; combined: 0.25)
- Buffer formula: Total Risk = Internal + External + Natural; rounded UP to nearest whole percent; 12% floor
- Floors and ceilings table: 12% floor, >60% overall FAIL, >35 Internal FAIL, >20 External FAIL, >35 Natural FAIL
- Kenya complete worked example: Total = 28% → 2,800 buffer VCUs withheld; 7,200 marketable at $25 = $180,000
- Buffer release mechanism: 15% of cumulative buffer released every 5 years of clean monitoring

**Other changes in Phase 7:**
- Updated `colorMap` in React app: added purple, cyan, rose
- Updated capstone completion stats: 10 modules / 33 lessons / 110+ quiz questions
- Footer updated: *"Made with 💚 for Muskan — She said she will read it. 🌱"*
- Pushed to GitHub and redeployed to Vercel (commit: `8946aa2`)

---

### Phase 8 — Gemini & Codex CLI Verification (current session)

All three new modules were reviewed against original PDFs using both Gemini CLI and Codex CLI in full permissionless mode. Total: 6 model runs × 3 modules.

#### Gemini CLI Review Findings & Fixes

**Module 7 (VT0008) — Gemini rating: 9.5/10**
- Fixed: Vietnam cost of equity was 10.37% (Group 1); corrected to 9.87% (Group 3 AFOLU, −0.5pp sector adjustment) → WACC corrected to 7.31%
- Added: LDC/SIDS/LIC simplified barrier analysis callout box (significant advantage for Global South developers)
- Added: Regulatory surplus vs additionality reminder box

**Module 8 (VMD0053) — Gemini rating: 9/10**
- Added: Petitions for exception callout (bias >PMU or coverage <90% not automatic fail if data scarcity; IME/VVB approval possible)
- Added: Default PMU values section (for studies without published standard errors; NAPT reference; depth-dependent PMU)
- Added: Sub-report requirement for peer-reviewed journal pathway (paper alone not sufficient)
- Added: Domain of Practice Effects note in PC definition (magnitude, form, timing, method must each be validated)

**Module 9 (AFOLU Buffer Tool) — Gemini rating: 9/10**
- Added: 12% minimum buffer floor (critical for project economics — even a score of 5 → 12% withheld)
- Added: Category-level FAIL ceilings table: Internal>35, External>20, Natural>35, Overall>60
- Updated: Critical Rules box and Summary calculation flow to include all ceilings and floor

#### Codex CLI Review Findings & Fixes

**Module 7 (VT0008) — 4 corrections:**
- Barrier types: added "unless methodology specifies other barriers (e.g., technological barriers)" caveat per PDF Section 5.3
- Step 4b: added ±50% capacity/output range and VCS+non-VCS project identification per PDF Section 5.5.2
- Excel requirements: added commercially sensitive info protection exception (VCS Standard Appendix 2); corrected depreciation treatment (non-cash, added back — not a cash outflow)
- Quiz: updated spreadsheet answer to reflect the commercially sensitive exception

**Module 8 (VMD0053) — 5 corrections:**
- **Critical arithmetic error fixed**: mean bias shown as `0/3 = -0.10` — corrected to `(-0.90)/3 = -0.30`
- Added "Why unweighted?" explanation for per-study bias (prevents large studies dominating acceptance)
- Added prediction interval vs confidence interval distinction note
- Substitution hierarchy: clarified same-CFG-first rule, then different-CFG (was previously skipping the first tier)
- Added: MVR must be submitted with each monitoring report

**Module 9 (AFOLU Risk Tool) — 4 corrections:**
- SE thresholds: `≥50%` and `≥20%` corrected to "more than 50%" and "more than 20%" per exact PDF Table 7 wording
- PL quiz answer corrected: rounding only applies to overall risk rating (Section 2.5.1), not to PL sub-score
- Natural risk table: significance ranges corrected to `50% to <70%`, `25% to <50%`, `5% to <25%`; last column header clarified
- LT max score: corrected from 32 to 37 points (includes WRC upstream/sea-impact factor from Table 6 Q7)

**Final deployment after verification passes:**
- Commit: `5880bd1`
- All 33 lessons present; 92 backticks (even); file size 373KB
- Live: https://sa-gray-tau.vercel.app

---

## Source Documents Used

| Document | Used For |
|----------|----------|
| `VM0042v2.2.pdf` (166 pages, Oct 2025) | All methodology content, Modules 1–5 |
| `Registration-and-Issuance-Process-v5.0.pdf` | Module 6.1, 6.2 registration steps |
| `VCS-Program-Guide-v5.0.pdf` | Module 6.2 VCU attributes, roles |
| `Clarification-Verra-Program-Fee-Schedule-April-2025.pdf` | Module 6.1 fee amounts |
| `VT0008-Additionality-Assessment-v1.0.pdf` | Module 7.1, 7.2 — four-step additionality tool |
| `VMD0053v2.1_BIOGEOCHEMICAL_MODEL_CALIBRATION_...pdf` | Module 8.1, 8.2 — model calibration, validation, IME |
| `AFOLU-Non-Permanence-Risk-Tool-v4.2-...pdf` | Module 9.1, 9.2 — buffer scoring, CID, SLR |

---

## Files in Project

```
/Users/knowprajjwal/Verra/
├── index.html                        ← Live entry point (deployed to Vercel)
├── VM0042_Learning_Module.html       ← Working copy (identical to index.html)
├── VM0042v2.2.pdf                    ← Primary source document
├── SESSION_LOG.md                    ← This file
└── VCS/
    ├── Registration-and-Issuance-Process-v5.0.pdf
    ├── VCS-Program-Guide-v5.0.pdf
    ├── Clarification-Verra-Program-Fee-Schedule-April-2025.pdf
    ├── VT0008-Additionality-Assessment-v1.0.pdf
    ├── VMD0053v2.1_BIOGEOCHEMICAL_MODEL_CALIBRATION_VALIDATION_AND_UNCERTAINTY_GUIDANCE_FOR_ALM_clean.pdf
    └── AFOLU-Non-Permanence-Risk-Tool-v4.2-last-updated-May-3-2024.pdf
```

---

## Git Commit History (Key Commits)

| Commit | Description |
|--------|-------------|
| Initial | Full course build: Modules 0–6 + Capstone |
| (earlier) | Phase 3 depth additions (ESM, CH₄, N₂O formulas) |
| (earlier) | Phase 4–5: Module 6, git init, Vercel deployment |
| `8946aa2` | Phase 7: Added Modules 7–9 (VT0008, VMD0053, AFOLU) |
| `4a68a2e` | Phase 8a: Gemini verification fixes |
| `5880bd1` | Phase 8b: Codex verification fixes (incl. arithmetic error) |

---

## Pending / Next Steps

All originally pending documents have now been covered (VT0008, VMD0053, AFOLU Non-Permanence Risk Tool).

### Possible future additions:
1. **IPCC 2006 Guidelines Vol. 4 (Agriculture)** — default emission factors for N₂O, enteric fermentation, manure management (referenced throughout VM0042 quantification sections)
2. **IPCC 2013 Wetlands Supplement** — default EFs for rice paddy CH₄ (referenced in Lesson 3.3)
3. **VM0051 or VM0042 Approach 2/3 deep-dive** — empirical/measurement-based approaches vs Approach 1 modelling
4. **IPCC AR6 Chapter 5** — latest soil carbon science (could update Lessons 0.2 and 3.2)
5. **Interactive calculator tool** — standalone buffer score calculator based on Module 9 scoring tables
