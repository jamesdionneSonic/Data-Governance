# Competitive UX Analysis: Data Governance & Data Catalog Tools
**Research Date:** May 2026 | **Sources:** Vendor sites, G2, Forrester, Gartner, Atlan comparison pages, Select Star comparison pages

---

## Executive Summary

The data catalog/governance tool landscape has split into two distinct UX philosophies:

1. **Legacy/Governance-first** (Collibra, Apache Atlas, Informatica): Powerful, compliance-grade, but notorious for steep learning curves, complex navigation, and poor adoption outside specialist teams.
2. **Modern/Adoption-first** (Atlan, Alation, Select Star, DataHub): Google-search-like discovery, embedded in daily tools (Slack, VS Code, BI tools), faster time to value.

The clearest competitive signal across all reviews: **non-technical user adoption is the #1 failure mode** for legacy tools. The tools winning in 2025–2026 are those that bring governance into existing workflows rather than requiring users to learn a new system.

---

## Tool-by-Tool Analysis

---

### 1. Alation — Data Intelligence Platform
**G2 Rating:** 4.4/5 (92 reviews, March 2026) | **Deployment:** 6–12 weeks

#### UI Design Philosophy
- **"Google for your data"** — search-first paradigm. Alation pioneered the idea that data discovery should feel like a web search.
- Behavioral analysis engine: surfaces the most-used, most-trusted datasets at the top of results based on actual query patterns — not just manual tagging.
- Trust flags, endorsements, and peer comments shown directly on asset cards ("Wikipedia-style" crowdsourced documentation).
- **Compose** SQL editor built in — analysts can write and share queries directly inside the catalog, bridging discovery and usage.
- "Alation Anywhere" browser extension brings catalog context into Tableau, Power BI, Excel, Slack, and Teams.

#### Key Workflow Patterns
- **Search → Understand → Trust → Use**: Linear, intuitive flow
- Crowdsourced curation: users leave comments and endorsements on data assets; ML surfaces the most popular ones
- Query sharing: best SQL queries are surfaced for reuse; non-technical users can run trusted queries without writing SQL
- Workflow Automation for metadata quality: automated routing of metadata tasks to data stewards

#### What Users Love
- Natural language search that actually works — "like Google for your data warehouse"
- Behavioral signals (query frequency, user endorsements) make it easy to find the *right* data, not just *any* data
- Strong analyst adoption — designed for data analysts first
- Broad connector library covering legacy + modern sources
- SQL Compose reduces context switching

#### What Users Complain About
- **UI is not easy for non-technical users** — business stakeholders struggle without training
- GenAI features are early-stage compared to Atlan
- Configuration cycles are long (6–12 weeks typical)
- No native data quality or observability — requires third-party integration
- G2 Lineage score: 7.3/10 (significantly below Atlan's 9.3/10)

#### Lineage Visualization
- End-to-end lineage view from source to destination
- Not as strong as Atlan on column-level granularity across modern stacks

#### G2 Scores (vs Atlan)
| Dimension | Alation | Atlan |
|---|---|---|
| Ease of Use | 8.3/10 | 9.0/10 |
| Data Discovery | 8.4/10 | 9.5/10 |
| Data Lineage | 7.3/10 | 9.3/10 |
| Business Glossary | 8.5/10 | 9.2/10 |
| Metadata Management | 8.0/10 | 9.3/10 |
| Quality of Support | 8.6/10 | 9.3/10 |

#### Design Elements Worth Adopting
- Trust flags / endorsement badges on asset cards
- Usage-based relevance ranking in search (show most-queried datasets first)
- Inline commenting on data assets
- Query sharing and reuse patterns

---

### 2. Collibra — Data Intelligence Platform
**G2 Rating:** 4.2/5 (March 2026) | **Deployment:** 3–9 months (some 12+) | **Price:** $100k+/year

#### UI Design Philosophy
- **Policy-first, workflow-driven**: built for governance officers and CDOs, not analysts
- Heavy stewardship workflows: configurable approval chains, task assignments, escalation rules, certification processes
- Active metadata graph: relationship visualization across policies, terms, assets, and systems
- Browser extensions surface catalog context inside Tableau and Power BI

#### Key Workflow Patterns
- The classic Collibra workflow: **Propose → Review → Approve → Certify → Retire** for business terms and data assets
- Highly configurable: every step in a stewardship workflow can be customized to match internal governance operating models
- Community management: data stewards, data owners, and data custodians have different views and tasks
- Pre-built regulatory reporting templates for BCBS 239, GDPR, SOX, Basel III

#### What Users Love
- Most configurable stewardship workflow engine in the market
- Deep compliance reporting and audit trails — trusted by BFSI and pharma
- Strong relationship visualization — users can see how policies connect to assets
- Enterprise-grade security and compliance (SOC 2, ISO 27001)

#### What Users Complain About (major)
- **Steep learning curve** — non-technical users consistently report confusion and abandonment
- **Complex navigation** — the UI is designed for governance specialists, not casual users
- **Slow deployment** — 3–9 months is the norm; 12+ months is not uncommon
- Modern data stack connectivity lags behind Atlan (Snowflake, dbt integration quality is weaker)
- Limited extensibility for custom metadata models without professional services
- **User adoption is the #1 reported failure mode** — organizations pay $100k+ but only governance specialists use it
- Separate login disconnected from daily workflow tools
- Select Star comparison: "Collibra's interface is more manual and primarily focused on data policy generation"
- No automated entity-relationship diagram generation
- No data usage analytics

#### Lineage Visualization
- Column-level lineage available but with "limited capabilities and scale" per competitors
- Relationship graph visualization for policies and assets is strong

#### Design Elements Worth Adopting
- Multi-stage approval workflow with configurable chains (for governance actions)
- Role-based views for different personas (steward vs. owner vs. consumer)
- Compliance template dashboards (GDPR, BCBS 239 pre-built views)
- Asset relationship graph/network view

---

### 3. Atlan — Modern Data Catalog / Context Layer
**G2 Rating:** 4.5/5 (121 reviews, March 2026) | **Deployment:** 4–6 weeks | **Analyst Rankings:** Gartner MQ Leader 2025, Forrester Wave Leader 2024 & 2025

#### UI Design Philosophy
- **Adoption-first UX**: the catalog must come to the user, not the other way around
- Personalized UI per persona — engineers see different defaults than analysts or governance teams
- Conversational, AI-powered search ("semantic search" for concepts, not just keywords)
- Context embedded into Slack, Microsoft Teams, Jira, GitHub, Google Sheets, VS Code — users never need to open a separate catalog tab
- "Data Marketplace" concept: assets are browseable like a product catalog, not just searchable in a list
- Active metadata: catalog updates automatically from dbt runs, Airflow DAGs, query history — no manual curation needed

#### Key Workflow Patterns
- **Unify → Bootstrap → Collaborate → Activate**: the four-stage context pipeline
- Context Agents auto-generate descriptions, metrics, and business definitions from SQL query history and BI semantics (87% rated on par or better than human writing)
- Human review and certification workflow — human-on-the-loop, not out of the loop
- Certified context flows to AI agents via MCP Server, SQL, and APIs
- Persona-based personalization: each role gets a customized browse experience

#### What Users Love
- Intuitive interface — non-technical users can actually use it
- Slack integration: data discovery Q&A without leaving Slack
- Fast time to value (4–6 weeks vs. months for legacy tools)
- Column-level lineage across Snowflake, dbt, Airflow, Tableau, Power BI — out of the box
- AI-generated descriptions eliminate the blank-canvas documentation problem
- Browser extensions and IDE plugins bring catalog into existing tools
- 80+ connectors with active metadata propagation (no schedules, always fresh)
- 95% of G2 users see Atlan as a "true partner"

#### What Users Complain About
- No self-serve tier for small teams — custom enterprise pricing only
- Legacy connectors (mainframe, SAP) lag behind Collibra and Informatica
- Complex policy configuration requires professional services at initial setup
- Some users report the breadth of features can be overwhelming initially

#### Lineage Visualization
- Column-level lineage across the full modern stack (dbt → Snowflake → Tableau, etc.)
- Interactive lineage graph with impact analysis — "which dashboards will break if I change this column?"
- Enterprise Data Graph: a traversable, living graph of all assets, relationships, and context
- Users can filter to relevant hop counts to reduce visual noise

#### Persona-Based Dashboards
- Personalization & Curation feature: every user gets a browse experience tailored to their domain and role
- Data Products Marketplace: domain teams publish certified data products; consumers browse and subscribe
- Engineer view: lineage, dbt model details, pipeline health
- Analyst view: trusted assets, business glossary, popular queries
- Governance view: policy status, certification queue, compliance posture

#### Design Elements Worth Adopting
- Slack-native search ("ask your data catalog in Slack")
- AI-bootstrapped documentation with human review/certification
- Persona-aware home page/dashboard
- "Data Marketplace" browse pattern (like an app store for data assets)
- Column-level lineage with impact radius visualization
- Embedded context in BI tools via browser extensions

---

### 4. DataHub — Open Source (LinkedIn)
**GitHub Stars:** 11,600+ | **License:** Apache 2.0 | **Deployment:** Self-hosted

#### UI Design Philosophy
- **API-first, engineer-designed**: the primary users are data engineers and platform engineers
- Push-based metadata ingestion model — assets register themselves via the Metadata Service API
- Domain-based browsing: assets are organized by business domain
- Lineage graph is a core UI feature — visualize upstream/downstream relationships
- Acryl Data offers a managed SaaS version for teams that want DataHub without self-hosting

#### Key Workflow Patterns
- GraphQL API for querying metadata programmatically
- Metadata ingestion via Kafka events or REST API — event-driven, near real-time
- Tag-based classification and business glossary
- Assertions (data quality tests) visible on asset pages

#### What Users Love
- Free to use at any scale (Apache 2.0)
- Active community (11,600+ GitHub stars)
- API-first — extensible to any downstream system
- Real-time metadata propagation via Kafka

#### What Users Complain About
- Business user UX lags far behind commercial tools
- Requires 0.5–1 FTE engineering to deploy and maintain
- No formal stewardship workflows for non-technical governance
- Graph visualization is functional but not polished
- Business glossary and certification features are less mature than Atlan/Alation

#### Lineage Visualization
- Interactive lineage graph with upstream/downstream navigation
- Column-level lineage supported
- Visual graph navigation is the most developer-friendly of the open-source options

#### Design Elements Worth Adopting
- Domain-centric browsing (organize assets by business domain, not just database/schema)
- Event-driven metadata propagation pattern (assets auto-register)
- Assertion/quality test status visible directly on asset pages

---

### 5. Apache Atlas — Open Source (Hadoop)
**GitHub Stars:** 2,100+ | **License:** Apache 2.0 | **Best for:** Hadoop/HBase/Hive ecosystems

#### UI Design Philosophy
- Hadoop-era design: functional but dated
- Built for integration with Apache Ranger (access control) and the broader Apache ecosystem
- Tag-based classification and lineage for Hive, HBase, Kafka, Spark

#### What Users Love
- Deep Hadoop ecosystem integration (no alternative for HBase/Hive shops)
- Native Apache Ranger integration for fine-grained access control
- Free to use

#### What Users Complain About
- Dated UI — significantly behind modern catalogs
- Not suitable for modern cloud data stacks
- Steep operational overhead
- Business user UX is essentially nonexistent

#### Design Elements Worth Adopting
- Tag propagation: tags applied to a source column automatically propagate to downstream assets — a concept modern tools now all use

---

### 6. Metaphor Data (metaphor.io) — now integrated into broader ecosystem
**Status:** Acquired/absorbed into the market. Originally focused on collaboration-first UX.

#### Key Design Philosophy (from pre-acquisition)
- Social/collaborative catalog: data assets had comment threads, "questions and answers" like Stack Overflow
- Emphasized human knowledge capture alongside automated metadata
- Persona pages: data assets linked to the people who own/know them best
- Strong Notion-like rich text documentation on asset pages

#### What Users Loved (broadly reported)
- "Ask a question" feature on assets — crowd-sourced Q&A on dataset pages
- Rich documentation editor (Notion-like blocks)
- People pages: who are the domain experts for this data?
- Slack notification when assets you follow change

#### Design Elements Worth Adopting
- Q&A thread on every asset page ("Has anyone used this for X?")
- People/expert pages linked to assets ("Ask Sarah about this table")
- Notification/subscription: follow an asset and get notified of changes

---

### 7. Select Star — Metadata Context Platform (now part of Snowflake)
**G2 Awards:** Fastest Implementation, Best ROI, Easiest Admin, High Performer | **Setup:** <24 hours

#### UI Design Philosophy
- **Simplicity over depth**: stripped down to what data consumers actually need day-to-day
- Automated: column-level lineage, ERDs, and usage analysis are generated automatically — zero manual curation required
- "Can trace a Tableau metric back to its source table in seconds"
- Ask AI feature: conversational interface to query your metadata

#### Key Workflow Patterns
- Instant lineage: click any column → see full upstream/downstream chain automatically
- Entity-Relationship Diagrams: inferred from SQL query logs and primary/foreign key relationships — no manual ERD creation
- Data usage analysis: which tables are most/least used, who queries them, query frequency trends

#### What Users Love
- Fastest setup in the market (<24 hours vs. months for Collibra)
- Automated everything — ERDs, lineage, usage analysis require zero effort
- Clean, uncluttered UI — easy for non-technical users
- Transparent, flexible pricing
- G2 "Best ROI" and "Easiest Admin" badges reflect genuine user satisfaction

#### What Users Complain About
- Lighter on formal governance workflows than Collibra
- Less deep on enterprise compliance features
- Smaller connector ecosystem than Atlan/Informatica
- Now part of Snowflake — roadmap uncertainty for non-Snowflake users

#### Lineage Visualization
- Column-level lineage with cross-platform support (Tableau ↔ Snowflake ↔ dbt, etc.)
- "Easy to navigate and accurate at scale" per their own comparison
- ERDs auto-generated from query logs — a unique differentiator

#### Design Elements Worth Adopting
- Auto-generated ERDs from query logs (not just from declared FK/PK)
- Usage analytics dashboard: popularity scores, query frequency, downstream consumer count
- Instant traceability: click a metric → see exactly which source table feeds it

---

### 8. Stemma (stemma.ai) — Acquired by Collibra
**Status:** Acquired by Collibra in 2022. Original product sunset.

#### What Made It Notable (pre-acquisition)
- Built by ex-Lyft engineers who created Amundsen
- Focused on automated metadata ingestion with minimal setup
- Business-friendly UX layered on top of Amundsen's discovery engine
- Marketed to SMBs who needed a catalog without Collibra's complexity

#### Lessons from Its Acquisition
- **Collibra bought Stemma to improve its UX for modern data stacks** — an implicit acknowledgment that Collibra's native UX was a problem
- The acquisition itself is a market signal: enterprise governance depth + modern UX simplicity is what everyone is chasing

---

### 9. Monte Carlo — Data Observability
**Focus:** Data quality monitoring and AI agent observability (not a catalog) | **Positioning:** "Trust your data in production"

#### UI Design Philosophy
- **Observability dashboard-first**: the primary UI is an incident feed / anomaly alert center
- Data quality monitoring: freshness, volume, schema drift, distribution anomalies — all visualized as time-series charts
- Root cause analysis workflow: when an incident fires, guide users step-by-step through diagnosis
- Lineage for impact analysis: "which dashboards are affected by this broken pipeline?"
- AI Agent Observability (2025): monitor, trace, and troubleshoot AI agents in production

#### Key Workflow Patterns
- Alert → Triage → Root Cause → Remediate → Close
- Circuit breaker dashboards for pipeline health
- SLA tracking with visual heat maps
- Data Quality Score cards per table/dataset

#### What Users Love
- Fast time to value — monitoring starts immediately after connection
- Incident timeline with lineage context — "what changed upstream?"
- Automated anomaly detection without writing rules
- AI observability for monitoring agent outputs vs. data inputs

#### What Users Complain About
- Not a cataloging tool — limited asset discovery and documentation
- Pricing complexity
- Some enterprises struggle with alert fatigue — too many low-signal notifications

#### Design Elements Worth Adopting
- **Data health scorecards** visible on every asset (freshness, completeness, volume trend)
- Pipeline incident feed with automatic lineage context
- Time-series quality charts at the column level
- SLA tracking dashboards with green/yellow/red status

---

## Cross-Competitor Analysis

---

### 1. Best UI Patterns from Each Competitor

| Pattern | Source Tool | Implementation Idea |
|---|---|---|
| Google-style natural language search | Alation | Primary search bar with ML-ranked results by usage frequency |
| Trust flags / endorsements | Alation | "Endorsed by 12 users" badge on asset cards |
| Persona-based home dashboard | Atlan | Different landing page for Engineer, Analyst, Governance roles |
| Slack-native discovery | Atlan, Secoda | `/datasearch` command returns catalog results in-channel |
| AI-generated descriptions with human review | Atlan | "AI Draft" → "Awaiting Review" → "Certified" status workflow |
| Data Marketplace browse | Atlan | App-store-style grid of certified data products by domain |
| Auto-generated ERDs from query logs | Select Star | Infer relationships from SQL JOINs, not just declared FK/PK |
| Usage analytics heatmap | Select Star | Show query frequency trends, top consumers, popularity rank |
| Q&A thread on asset pages | Metaphor | Stackoverflow-style Q&A on every table/dashboard page |
| Data health scorecards | Monte Carlo | Freshness, volume, null-rate scores visible in search results |
| Domain-based asset browsing | DataHub | Top-level navigation by business domain, not DB schema |
| Compliance template dashboards | Collibra | Pre-built views for GDPR, SOX audit status |
| Column lineage with impact radius | Atlan | "3 dashboards and 1 ML model will break if you change this column" |
| Configurable stewardship workflows | Collibra | Multi-stage approval chains with escalation rules |

---

### 2. Most Common User Complaints (Universal Pain Points)

1. **Adoption problem** — technical teams set it up, but business users never return after the first week
2. **Blank canvas** — catalog is empty until someone fills it in manually; no automated documentation
3. **Context switching** — users must leave their BI/SQL tool, go to the catalog, find info, come back
4. **Stale metadata** — cataloged data goes out of date as schemas change; no real-time sync
5. **Governance = compliance theater** — policies exist in the catalog but nobody enforces them in practice
6. **Search relevance** — returning 10,000 results with no quality signal is useless
7. **Lineage opacity** — table-level lineage isn't granular enough; users need column-level

---

### 3. UI Features Users Praise Most (across all tools)

1. **Instant lineage**: click → see full upstream/downstream chain in seconds
2. **Natural language search**: type a business concept, get the right table
3. **Usage signals in search**: most-queried, most-endorsed assets rank higher
4. **AI-generated descriptions**: eliminate blank-canvas documentation fatigue
5. **Slack integration**: query the catalog without leaving the tool you're already in
6. **Data quality scores visible in search results**: before opening an asset, know if it's trustworthy
7. **Column-level impact analysis**: "which reports break if I touch this column?"
8. **Browser extensions for BI tools**: see catalog context inside Tableau/Power BI without switching

---

### 4. Navigation/Workflow Patterns That Stand Out

| Pattern | Description | Best Example |
|---|---|---|
| **Search-first home page** | No dashboard, just a Google-style search box | Alation, Atlan |
| **Domain-first browse** | Top-level nav by business domain (Finance, Marketing, Operations) | DataHub, Atlan |
| **Data Products Marketplace** | App-store grid: certified datasets with owner, quality score, subscriber count | Atlan |
| **My Data page** | Personalized view: assets I own, assets I follow, my recent searches | Multiple |
| **Stewardship task inbox** | Governance-focused users see a queue of pending reviews/certifications | Collibra, Atlan |
| **Pipeline health dashboard** | Overview of ingestion jobs, freshness status, recent incidents | Monte Carlo |
| **Impact analysis flyout** | Click a column → see downstream consumers without leaving the page | Select Star, Atlan |

---

### 5. Graph/Lineage Visualization Approaches

| Tool | Granularity | Strengths | Weaknesses |
|---|---|---|---|
| **Atlan** | Column-level | Cross-platform (dbt→Snowflake→Tableau), auto-updated, impact radius | Can be complex for large graphs |
| **Alation** | Table+column | Good for mixed legacy/modern stacks | Weaker on modern stack column-level |
| **Select Star** | Column-level | Accurate, auto-inferred ERDs from query logs | Smaller ecosystem |
| **Collibra** | Table→column | Strong policy-to-asset relationship graph | Complex UI, limited scale |
| **DataHub** | Column-level | Clean graph navigation, API-accessible | Less polished than commercial tools |
| **Monte Carlo** | Table-level | Best for incident-driven impact analysis | Not a full catalog lineage |
| **Apache Atlas** | Entity-level | Deep Hadoop integration | Dated UI, no modern stack support |

**Best Practices for Lineage UI (derived from research):**
- Start at the asset level → click to expand columns
- Use color to show: healthy (green) / degraded (yellow) / broken (red) nodes in the graph  
- Show impact radius as a count badge ("3 downstream reports")
- Allow filtering by hop count to reduce visual noise on large graphs
- Cross-platform icons to immediately identify source type (Snowflake ❄️, dbt 🔵, Tableau 📊)

---

### 6. Persona-Based Dashboard Approaches

| Persona | Atlan Approach | Collibra Approach | Alation Approach |
|---|---|---|---|
| **Data Engineer** | Lineage graph, dbt model health, pipeline status | Asset relationship graph, glossary terms | Compose SQL editor, lineage view |
| **Data Analyst** | Semantic search, trusted datasets, popular queries | Data dictionary browse | Search + behavioral recommendations |
| **Data Steward** | Certification queue, task inbox, policy violations | Workflow task manager, approval chains | Stewardship workflows |
| **Business User** | Business glossary, domain browse, Slack/Teams access | Business glossary (complex) | Limited — analyst-first |
| **CDO/Governance** | Compliance posture, certification rates, adoption metrics | Regulatory templates, audit reports | Analytics dashboard |

**Key insight**: Tools that fail at adoption almost always have the same problem — they designed for the CDO/steward persona and forgot that the most important persona is the **casual business user** who just needs to find the right table.

---

### 7. Design Elements Worth Adopting for Our Platform

#### High Priority (proven to drive adoption)
1. **Persona-aware home page**: engineer sees pipeline health + lineage; analyst sees popular trusted datasets; governance sees certification queue — same platform, different entry points
2. **AI-generated descriptions with human review pipeline**: Generate → Review → Certify workflow, with quality grade visible (AI Draft vs. Human Certified vs. Pending Review)
3. **Usage-ranked search results**: most-queried, most-endorsed assets rank higher — behaviorally determined trust, not just manual tags
4. **Column-level lineage with impact radius**: "changing this column will affect 3 dashboards and 1 ML model" — immediate consequence visibility
5. **Data health scorecard on every asset**: freshness (last updated), completeness (null %), quality score, popularity rank — visible in search results, not just asset detail pages
6. **Q&A thread per asset**: crowd-sourced documentation — "has anyone used this for month-over-month revenue? @sarah confirmed it works" 

#### Medium Priority (differentiating features)
7. **Domain-first navigation**: top-level browse by business domain, not database/schema hierarchy
8. **Data Products Marketplace**: app-store grid showing certified data products with owner, quality badge, subscriber count, SLA
9. **Stewardship task inbox**: governance users start their day with a queue of pending certifications, policy violations, and review requests
10. **Auto-generated ERDs from query logs**: infer JOIN relationships from SQL history — more accurate than declared FK/PK alone
11. **Context in Slack**: `/catalog search customer_orders` returns asset card with owner, quality score, and lineage summary
12. **Impact analysis flyout panel**: column click → side panel shows downstream consumers without full page navigation

#### Quick Wins (copy directly)
13. **Trust badges on asset cards**: Endorsed ✓, Warning ⚠, Deprecated ❌ — visible in search results
14. **Certification status chip**: "Human Certified", "AI Draft", "Unreviewed" — color-coded state machine
15. **Popularity rank chip**: "Top 5% most queried this month" — social proof in discovery
16. **Owner avatar + name on every asset**: immediate accountability, click to message them

---

## Competitive Positioning Matrix

```
                        HIGH ENTERPRISE GOVERNANCE
                               |
         Collibra ────────────┤──── Informatica IDMC
                               |       
 COMPLEX ──────────────────────┤────────────────────── SIMPLE
  UX                           |                        UX
                         Alation
                               |
         Apache Atlas          │    Atlan ────── Select Star
                               │       
                         DataHub      Secoda
                               |
                        LOW ENTERPRISE GOVERNANCE
```

---

## Summary Recommendations

**For search and discovery UX**: Copy Alation's behavioral ranking + Atlan's AI semantic search. Users should be able to type "customer revenue by quarter" and get the right table, not a list of 200 results with "revenue" in the name.

**For lineage UX**: Copy Select Star's auto-inferred ERDs + Atlan's column-level impact analysis. Make lineage interactive, not just a static diagram.

**For governance workflows**: Copy Collibra's multi-stage approval chains but simplify the UI dramatically. Govern the process, not the user interface.

**For adoption**: Copy Atlan's embedded context (Slack, browser extensions) + Metaphor's Q&A threads. The catalog that gets used is the one that shows up where people already work.

**For data quality visibility**: Copy Monte Carlo's health scorecards. Every asset in search results should show freshness, quality score, and recent incident status.

**The single most important lesson**: The tools with the best governance depth (Collibra, Informatica) have the worst adoption. The tools with the best adoption (Atlan, Select Star, Secoda) won by making governance invisible — it happens automatically, without requiring users to change their behavior. **Design for the analyst first; the governance officer will follow.**
