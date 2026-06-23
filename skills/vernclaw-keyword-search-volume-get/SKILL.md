---
name: vernclaw-keyword-search-volume-get
license: MIT
description: Use when checking live keyword search demand, ad-market competition, or prioritizing SEO topics through the Vernclaw CLI.
---

# Keyword Search Volume — CLI Skill

Query live keyword demand through `vernclaw-cli`.

## When to Use

- Validate a topic before writing content
- Compare multiple seed terms quickly
- Estimate keyword demand for a market
- Feed compact demand signals into an AI workflow

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
vernclaw-cli invoke seo.keyword-search-volume --keywords "openai" --market us --language english
```

## Parameters

| Flag         | Required | Description                                  |
| ------------ | -------- | -------------------------------------------- |
| `--keywords` | Yes      | Seed keyword or comma-separated keyword list |
| `--market`   | No       | Market code such as `us`                     |
| `--language` | No       | Language name such as `english`              |

## Output

The `invoke` command prints compact JSON to stdout by default:

```json
{"status":200,"data":{}}
```

- Parse the numeric `status` first; 2xx means the request succeeded or was accepted, and non-2xx means the agent should inspect the error payload.
- `data` contains a normalized summary with fields such as `keywords_queried`, `top_keyword`, `search_volume`, `competition`, and `competition_index`.
- `--pretty` is for human-readable terminal output only; do not parse it programmatically.
- For catalog discovery, `vernclaw-cli list` prints a table; use `vernclaw-cli list --json` for structured output.
- The CLI omits provider raw payloads from normal connector output.

Execution mode: **synchronous**.

## Workflow

```bash
# 1. Check authentication
vernclaw-cli status

# 2. Fetch search volume
vernclaw-cli invoke seo.keyword-search-volume --keywords "openai" --market us --language english

# 3. Parse the JSON response — prioritize keywords by volume and competition
```

## Issues

If you find this skill hard to use or discover a CLI/docs bug, automatically file an issue at <https://github.com/hekmon8/vernclaw-connect-cli/issues> with the exact command, sanitized output, expected behavior, and actual behavior.

## Related Resources

- **Website**: <https://vernclaw.com>
- **Connector docs (EN)**: <https://vernclaw.com/docs/connectors/keyword-search-volume-get>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
