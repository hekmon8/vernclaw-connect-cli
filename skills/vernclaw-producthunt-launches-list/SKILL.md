---
name: vernclaw-producthunt-launches-list
description: Use when listing Product Hunt launches through Vernclaw CLI.
---

# Product Hunt Launches List — CLI Skill

List public Product Hunt launches for a date or date window through `vernclaw-cli` and return normalized launch rows.

## When to Use

- Build a daily Product Hunt launch radar
- Compare launch days and public traction signals
- Collect normalized product rows before summarizing startup launches

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
vernclaw-cli invoke list.producthunt.launches --date 2026-06-09 --limit 10 --featured-only true
vernclaw-cli invoke list.producthunt.launches --from-date 2026-06-01 --to-date 2026-06-09 --limit 20
```

## Parameters

| Flag              | Required | Description                                 |
| ----------------- | -------- | ------------------------------------------- |
| `--date`          | No       | Launch date in `YYYY-MM-DD`                 |
| `--from-date`     | No       | Lower date bound in `YYYY-MM-DD`            |
| `--to-date`       | No       | Upper date bound in `YYYY-MM-DD`            |
| `--limit`         | No       | Number of launches to return                |
| `--featured-only` | No       | Request featured Product Hunt launches only |

## Output

The `invoke` command prints compact JSON to stdout by default:

```text
{"status":200,"data":{}}
```

- Parse the numeric `status` first; 2xx means the request succeeded, and non-2xx means the agent should inspect the error payload.
- `data` contains a normalized summary plus `items` rows with rank, Product Hunt URL, website URL, name, tagline, makers, topics, public votes, comments, `source`, `source_mode`, and limitations.
- `--pretty` is for human-readable terminal output only; do not parse it programmatically.
- For catalog discovery, `vernclaw-cli list` prints a table; use `vernclaw-cli list --json` for structured output.
- The CLI omits provider raw payloads from normal connector output.

Execution mode: **synchronous**.

Limits: Effective Product Hunt page size is capped at 20 to stay within upstream GraphQL complexity limits. Active launch-day ranks can change as votes and comments update.

## Workflow

```bash
# 1. Check authentication
vernclaw-cli status

# 2. List launches for a date
vernclaw-cli invoke list.producthunt.launches --date 2026-06-09 --limit 10

# 3. Parse JSON response and use data.items as launch rows
```

## Issues

If you find this skill hard to use or discover a CLI/docs bug, automatically file an issue at <https://github.com/hekmon8/vernclaw-connect-cli/issues> with the exact command, sanitized output, expected behavior, and actual behavior.

## Related Resources

- **Website**: <https://vernclaw.com>
- **Connector docs (EN)**: <https://vernclaw.com/docs/connectors/producthunt-launches-list>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
