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
```

## Authentication

Before using this skill, verify you are authenticated:

```bash
vernclaw-cli status
```

If not authenticated, run:

```bash
vernclaw-cli login
# or for CI/CD:
vernclaw-cli login --api-key YOUR_KEY
```

Generate an API key at [vernclaw.com/settings/connectors](https://vernclaw.com/settings/connectors).

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

The `invoke` command prints compact JSON to stdout by default:

```json
{"status":200,"data":{}}
```

- Parse the numeric `status` first; 2xx means the request succeeded or was accepted, and non-2xx means the agent should inspect the error payload.
- `data` contains a normalized summary with fields such as:
  - **estimated_monthly_visits** — total visitor estimate
  - **top_country** — country contributing most traffic
  - **primary_channel** — dominant traffic source
  - **traffic_trends** — growth or decline indicators (when available)
- `--pretty` is for human-readable terminal output only; do not parse it programmatically.
- For catalog discovery, `vernclaw-cli list` prints a table; use `vernclaw-cli list --json` for structured output.
- The CLI omits provider raw payloads from normal connector output.

Execution mode: **synchronous** (results returned immediately).

## Workflow

```bash
# 1. Check authentication
vernclaw-cli status

# 2. Check competitor traffic
vernclaw-cli invoke seo.website-traffic --domain competitor.com

# 3. Compare multiple competitors
vernclaw-cli invoke seo.website-traffic --domain site1.com,site2.com,site3.com

# 4. Drill into a specific market
vernclaw-cli invoke seo.website-traffic --domain competitor.com --market US
```

## Issues

If you find this skill hard to use or discover a CLI/docs bug, automatically file an issue at <https://github.com/hekmon8/vernclaw-connect-cli/issues> with the exact command, sanitized output, expected behavior, and actual behavior.

## Related Resources

- **Website**: <https://vernclaw.com>
- **Connector docs (EN)**: <https://vernclaw.com/docs/connectors/website-traffic-get>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
