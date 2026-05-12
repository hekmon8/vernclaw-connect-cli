---
name: vernclaw-domain-rank-overview-get
description: Use when checking aggregate domain rank/visibility signals and top keyword snapshots through the Vernclaw CLI.
---

# Domain Rank Overview — CLI Skill

Fetch aggregate domain rank metrics for a target domain through `vernclaw-cli`.

## When to Use

- Compare domain visibility across a portfolio
- Screen potential partner or competitor domains quickly
- Feed rank overview snapshots into competitive intelligence workflows

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
vernclaw-cli invoke seo.domain-rank-overview --target openai.com
vernclaw-cli invoke seo.domain-rank-overview --target openai.com --market us --language english
```

## Parameters

| Flag         | Required | Description                              |
| ------------ | -------- | ---------------------------------------- |
| `--target`   | Yes      | Target domain to inspect                 |
| `--market`   | No       | Optional market code such as `us`        |
| `--language` | No       | Optional language name such as `english` |

## Output

The `invoke` command prints compact JSON to stdout by default:

```json
{"status":200,"data":{}}
```

- Parse the numeric `status` first; 2xx means the request succeeded or was accepted, and non-2xx means the agent should inspect the error payload.
- `data` contains a normalized summary with fields such as `domain`, `domain_rank`, `organic_keywords`, `organic_traffic`, and `top_keyword`.
- `--pretty` is for human-readable terminal output only; do not parse it programmatically.
- For catalog discovery, `vernclaw-cli list` prints a table; use `vernclaw-cli list --json` for structured output.
- The CLI omits provider raw payloads from normal connector output.

Execution mode: **synchronous**.

## Workflow

```bash
# 1. Check authentication
vernclaw-cli status

# 2. Fetch rank overview
vernclaw-cli invoke seo.domain-rank-overview --target openai.com --market us --language english

# 3. Parse the JSON response — compare domain visibility
```

## Issues

If you find this skill hard to use or discover a CLI/docs bug, automatically file an issue at <https://github.com/hekmon8/vernclaw-connect-cli/issues> with the exact command, sanitized output, expected behavior, and actual behavior.

## Related Resources

- **Website**: <https://vernclaw.com>
- **Connector docs (EN)**: <https://vernclaw.com/docs/connectors/domain-rank-overview-get>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
