---
name: vernclaw-domain-authority-get
license: MIT
description: Use when checking free Domain Rating (DR) scores or comparing SEO competitiveness across websites via the Vernclaw CLI.
---

# Domain Authority Checker — CLI Skill

Check any domain's free Domain Rating (DR) score through the `vernclaw-cli`.

## When to Use

- Evaluate a website's SEO strength and ranking potential
- Compare authority across competitor domains
- Screen link-building prospects by DR before deeper backlink analysis
- Assess domain value for acquisition or partnership decisions

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
# Single domain
vernclaw-cli invoke seo.domain-authority --domain example.com

# Multiple domains (comma-separated)
vernclaw-cli invoke seo.domain-authority --domain example.com,competitor.com,rival.com
```

## Parameters

| Flag       | Required | Description                                    |
| ---------- | -------- | ---------------------------------------------- |
| `--domain` | Yes      | One or more domains to query (comma-separated) |

## Output

The `invoke` command prints compact JSON to stdout by default:

```json
{"status":200,"data":{}}
```

- Parse the numeric `status` first; 2xx means the request succeeded or was accepted, and non-2xx means the agent should inspect the error payload.
- `data` contains a normalized summary and `metrics` with fields such as:
  - **domain** — normalized target domain
  - **domain_rating** — DR score on a 0–100 scale
  - **ahrefs_rank** — returned when the upstream free endpoint provides it
- `--pretty` is for human-readable terminal output only; do not parse it programmatically.
- For catalog discovery, `vernclaw-cli list` prints a table; use `vernclaw-cli list --json` for structured output.
- The CLI omits provider raw payloads from normal connector output.

This connector is free to invoke (`credits_cost` is 0). The free DR endpoint does not include detailed backlink or referring-domain counts; use backlink connectors for link-level evidence.

Execution mode: **synchronous** (results returned immediately).

## Workflow

```bash
# 1. Check authentication
vernclaw-cli status

# 2. Check your own domain
vernclaw-cli invoke seo.domain-authority --domain mysite.com

# 3. Compare with top competitors
vernclaw-cli invoke seo.domain-authority --domain mysite.com,competitor1.com,competitor2.com
```

## Issues

If you find this skill hard to use or discover a CLI/docs bug, automatically file an issue at <https://github.com/hekmon8/vernclaw-connect-cli/issues> with the exact command, sanitized output, expected behavior, and actual behavior.

## Related Resources

- **Website**: <https://vernclaw.com>
- **Connector docs (EN)**: <https://vernclaw.com/docs/connectors/domain-authority-get>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
