---
name: website-traffic-get
description: Use when estimating website traffic, analyzing traffic sources and geographic distribution, or benchmarking competitor traffic via the Vernclaw CLI.
---

# Website Traffic Checker — CLI Skill

Estimate any website's monthly visits, primary traffic channels, and geographic distribution through the `vernclaw-cli`.

## When to Use

- Estimate competitor or prospect website traffic
- Identify primary traffic channels (organic, direct, referral, social, paid)
- Analyze geographic distribution of visitors
- Benchmark traffic before and after marketing campaigns

## Prerequisites

```bash
npm i -g vernclaw-connect-cli
vernclaw-cli login
```

If you need an API key for CI/CD, generate one at [vernclaw.com/settings/connectors](https://vernclaw.com/settings/connectors) and run `vernclaw-cli login --api-key YOUR_KEY`.

## Invocation

```bash
# Global traffic estimate
vernclaw-cli invoke seo.website-traffic --domain example.com

# Traffic for a specific market
vernclaw-cli invoke seo.website-traffic --domain example.com --market US

# Multiple domains
vernclaw-cli invoke seo.website-traffic --domain example.com,competitor.com
```

## Parameters

| Flag       | Required | Description                                                        |
| ---------- | -------- | ------------------------------------------------------------------ |
| `--domain` | Yes      | One or more domains to query (comma-separated)                     |
| `--market` | No       | Country/region code to filter traffic data (e.g. `US`, `UK`, `CN`) |

## Output

Markdown table to `stdout` containing:

- **Estimated Monthly Visits** — total visitor estimate
- **Top Country** — country contributing most traffic
- **Primary Channel** — dominant traffic source
- **Traffic Trends** — growth or decline indicators (when available)

Execution mode: **synchronous** (results returned immediately).

## Example Workflow

```bash
# 1. Check competitor traffic
vernclaw-cli invoke seo.website-traffic --domain competitor.com

# 2. Compare multiple competitors
vernclaw-cli invoke seo.website-traffic --domain site1.com,site2.com,site3.com

# 3. Drill into a specific market
vernclaw-cli invoke seo.website-traffic --domain competitor.com --market US

# 4. Combine with authority check
vernclaw-cli invoke seo.domain-authority --domain competitor.com
```

## Related Resources

- **Connector docs (EN)**: <https://vernclaw.com/docs/connectors/website-traffic-get> · [GitHub](../../content/docs/connectors/website-traffic-get.mdx)
- **Connector docs (中文)**: <https://vernclaw.com/zh/docs/connectors/website-traffic-get> · [GitHub](../../content/docs/connectors/website-traffic-get.zh.mdx)
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
- **API reference**: <https://vernclaw.com/docs/connectors/api>
- **Connector catalog**: <https://vernclaw.com/connectors>
