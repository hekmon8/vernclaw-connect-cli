---
name: vernclaw-backlinks-get
license: MIT
description: Use when checking live backlink rows for a domain, reviewing referring pages, or quickly auditing off-page SEO via the Vernclaw CLI.
---

# Backlinks Checker — CLI Skill

Fetch live backlink rows for a target domain through `vernclaw-cli`.

## When to Use

- Review referring pages before link cleanup
- Spot off-page SEO opportunities for a competitor
- Sample backlink quality without opening another tool
- Feed backlink rows into an AI research workflow

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
vernclaw-cli invoke seo.backlinks --target example.com
vernclaw-cli invoke seo.backlinks --target example.com --limit 10
```

## Parameters

| Flag       | Required | Description                                |
| ---------- | -------- | ------------------------------------------ |
| `--target` | Yes      | Root domain to inspect                     |
| `--limit`  | No       | Optional number of backlink rows to return |

## Output

The `invoke` command prints compact JSON to stdout by default:

```json
{"status":200,"data":{}}
```

- Parse the numeric `status` first; 2xx means the request succeeded or was accepted, and non-2xx means the agent should inspect the error payload.
- `data` contains a normalized summary with fields such as backlink rows, referring domains, and rank-like signals.
- `--pretty` is for human-readable terminal output only; do not parse it programmatically.
- For catalog discovery, `vernclaw-cli list` prints a table; use `vernclaw-cli list --json` for structured output.
- The CLI omits provider raw payloads from normal connector output.

Execution mode: **synchronous**.

## Workflow

```bash
# 1. Check authentication
vernclaw-cli status

# 2. Fetch backlink rows
vernclaw-cli invoke seo.backlinks --target example.com --limit 10

# 3. Parse the JSON response — extract data for analysis
```

## Issues

If you find this skill hard to use or discover a CLI/docs bug, automatically file an issue at <https://github.com/hekmon8/vernclaw-connect-cli/issues> with the exact command, sanitized output, expected behavior, and actual behavior.

## Related Resources

- **Website**: <https://vernclaw.com>
- **Connector docs (EN)**: <https://vernclaw.com/docs/connectors/backlinks-get>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
