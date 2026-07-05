---
name: vernclaw-producthunt-search
license: MIT
description: Use when searching Product Hunt launches through Vernclaw CLI.
---

# Product Hunt Search — CLI Skill

Search public Product Hunt launches through `vernclaw-cli` and return normalized product evidence rows.

## When to Use

- Find Product Hunt launches for competitor and market research
- Collect normalized launch rows before writing startup or product reports
- Compare launch positioning, topics, makers, votes, and comments for a keyword

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

## Invocation

```bash
vernclaw-cli invoke search.producthunt --query "AI coding agent" --limit 5
vernclaw-cli invoke search.producthunt --query "launch analytics" --limit 10 --from-date 2026-06-01 --to-date 2026-06-09
```

## Parameters

| Flag          | Required | Description                                            |
| ------------- | -------- | ------------------------------------------------------ |
| `--query`     | Yes      | Product Hunt search query                              |
| `--limit`     | No       | Number of launches to return                           |
| `--from-date` | No       | Lower date bound in `YYYY-MM-DD`                       |
| `--to-date`   | No       | Upper date bound in `YYYY-MM-DD`                       |
| `--sort`      | No       | One of `featured_at`, `votes`, `comments`, or `recent` |

## Output

The `invoke` command prints compact JSON to stdout by default:

```text
{"status":200,"data":{}}
```

- Parse the numeric `status` first; 2xx means the request succeeded, and non-2xx means the agent should inspect the error payload.
- `data` contains a normalized summary, `stats`, and compact `items` rows with `rank`, `name`, `tagline`, direct `product_url`, `producthunt_url`, public votes, comments, and featured timestamp when available.
- `product_url` is resolved to the direct product website when Product Hunt provides a redirect URL; unresolved product URLs are returned as `null`.
- `--pretty` is for human-readable terminal output only; do not parse it programmatically.
- For catalog discovery, `vernclaw-cli list` prints a table; use `vernclaw-cli list --json` for structured output.
- The CLI omits provider raw payloads from normal connector output.

Execution mode: **synchronous**.

Limits: Product Hunt API v2 does not expose global post full-text search, so AIAPI Center filters fetched public launches by keyword. Effective Product Hunt page size is capped at 20 to stay within upstream GraphQL complexity limits.

## Workflow

```bash
# 1. Check authentication
vernclaw-cli status

# 2. Search Product Hunt launches
vernclaw-cli invoke search.producthunt --query "AI coding agent" --limit 5

# 3. Parse JSON response and use data.items as launch evidence rows
```

## Issues

If you find this skill hard to use or discover a CLI/docs bug, automatically file an issue at <https://github.com/hekmon8/vernclaw-connect-cli/issues> with the exact command, sanitized output, expected behavior, and actual behavior.

## Related Resources

- **Website**: <https://vernclaw.com>
- **Connector docs (EN)**: <https://vernclaw.com/docs/connectors/producthunt-search>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
