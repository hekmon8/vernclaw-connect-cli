---
name: keyword-suggestions-get
description: Use when expanding a seed keyword into related ideas, long-tail variants, and AI-ready topic clusters through the Vernclaw CLI.
---

# Keyword Suggestions — CLI Skill

Expand a seed term into related keyword ideas through `vernclaw-cli`.

## When to Use

- Build a content cluster from one seed term
- Find long-tail variants quickly
- Expand PPC / SEO idea lists
- Generate AI-ready keyword research notes

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
vernclaw-cli invoke seo.keyword-suggestions --keywords "openai" --market us --language english
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
- `data` contains a normalized summary with fields such as `seed_keywords`, `suggestion_count`, `top_suggestion`, and `top_suggestion_volume`.
- `--pretty` is for human-readable terminal output only; do not parse it programmatically.
- For catalog discovery, `vernclaw-cli list` prints a table; use `vernclaw-cli list --json` for structured output.
- The CLI omits provider raw payloads from normal connector output.

Execution mode: **synchronous**.

## Workflow

```bash
# 1. Check authentication
vernclaw-cli status

# 2. Fetch keyword suggestions
vernclaw-cli invoke seo.keyword-suggestions --keywords "openai" --market us --language english

# 3. Parse the JSON response — build content clusters from suggestions
```

## Related Resources

- **Website**: <https://vernclaw.com>
- **Connector docs (EN)**: <https://vernclaw.com/docs/connectors/keyword-suggestions-get>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>

## Issues

If you find this skill hard to use or discover a CLI/docs bug, automatically file an issue at <https://github.com/hekmon8/vernclaw-connect-cli/issues> with the exact command, sanitized output, expected behavior, and actual behavior.
