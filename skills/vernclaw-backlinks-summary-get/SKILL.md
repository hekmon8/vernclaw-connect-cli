---
name: vernclaw-backlinks-summary-get
description: Use when auditing a domain with aggregated backlink metrics instead of row-level backlink lists through the Vernclaw CLI.
---

# Backlinks Summary — CLI Skill

Fetch backlink summary metrics for a target domain through `vernclaw-cli`.

## When to Use

- Get a quick view of backlink scale before deeper audits
- Compare domains using total backlinks and referring domain counts
- Validate backlink growth direction in weekly SEO reviews

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
vernclaw-cli invoke seo.backlinks-summary --target openai.com
vernclaw-cli invoke seo.backlinks-summary --target openai.com --limit 20 --offset 0
```

## Parameters

| Flag       | Required | Description                               |
| ---------- | -------- | ----------------------------------------- |
| `--target` | Yes      | Root domain to inspect                    |
| `--limit`  | No       | Optional number of rows sampled in inputs |
| `--offset` | No       | Optional pagination offset                |

## Output

The `invoke` command prints compact JSON to stdout by default:

```json
{"status":200,"data":{}}
```

- Parse the numeric `status` first; 2xx means the request succeeded or was accepted, and non-2xx means the agent should inspect the error payload.
- `data` contains a normalized summary with fields such as `target`, `total_backlinks`, `referring_domains`, and `top_referring_domain`.
- `--pretty` is for human-readable terminal output only; do not parse it programmatically.
- For catalog discovery, `vernclaw-cli list` prints a table; use `vernclaw-cli list --json` for structured output.
- The CLI omits provider raw payloads from normal connector output.

Execution mode: **synchronous**.

## Workflow

```bash
# 1. Check authentication
vernclaw-cli status

# 2. Fetch backlink summary
vernclaw-cli invoke seo.backlinks-summary --target openai.com

# 3. Parse the JSON response — extract metrics for comparison
```

## Issues

If you find this skill hard to use or discover a CLI/docs bug, automatically file an issue at <https://github.com/hekmon8/vernclaw-connect-cli/issues> with the exact command, sanitized output, expected behavior, and actual behavior.

## Related Resources

- **Website**: <https://vernclaw.com>
- **Connector docs (EN)**: <https://vernclaw.com/docs/connectors/backlinks-summary-get>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
