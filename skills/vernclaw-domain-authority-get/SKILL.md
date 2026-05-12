---
name: vernclaw-domain-authority-get
description: Use when checking domain authority scores, analyzing backlink profiles, or comparing SEO competitiveness across websites via the Vernclaw CLI.
---

# Domain Authority Checker — CLI Skill

Check any domain's authority score (0–100), backlink count, and link quality through the `vernclaw-cli`.

## When to Use

- Evaluate a website's SEO strength and ranking potential
- Compare authority across competitor domains
- Audit backlink quality before link-building campaigns
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
- `data` contains a normalized summary with fields such as:
  - **authority_score** — 0–100 composite score
  - **backlink_count** — total effective backlinks
  - **link_quality** — distribution across high / medium / low tiers
- `--pretty` is for human-readable terminal output only; do not parse it programmatically.
- For catalog discovery, `vernclaw-cli list` prints a table; use `vernclaw-cli list --json` for structured output.
- The CLI omits provider raw payloads from normal connector output.

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
