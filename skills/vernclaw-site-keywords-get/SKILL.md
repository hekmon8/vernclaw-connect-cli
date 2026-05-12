---
name: vernclaw-site-keywords-get
description: Use when reviewing a domain's keyword footprint, comparing competitors, or finding content gaps through the Vernclaw CLI.
---

# Site Keywords — CLI Skill

Inspect a domain's keyword coverage through `vernclaw-cli`.

## When to Use

- Map a competitor’s keyword footprint
- Find content gaps for your site
- Compare multiple domains consistently
- Summarize domain coverage for AI analysis

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
vernclaw-cli invoke seo.site-keywords --target openai.com --market us --language english
```

## Parameters

| Flag         | Required | Description                     |
| ------------ | -------- | ------------------------------- |
| `--target`   | Yes      | Root domain to inspect          |
| `--market`   | No       | Market code such as `us`        |
| `--language` | No       | Language name such as `english` |

## Output

The `invoke` command prints compact JSON to stdout by default:

```json
{"status":200,"data":{}}
```

- Parse the numeric `status` first; 2xx means the request succeeded or was accepted, and non-2xx means the agent should inspect the error payload.
- `data` contains a normalized summary with fields such as `target`, `fetched_keywords`, `top_keyword`, and `top_keyword_volume`.
- `--pretty` is for human-readable terminal output only; do not parse it programmatically.
- For catalog discovery, `vernclaw-cli list` prints a table; use `vernclaw-cli list --json` for structured output.
- The CLI omits provider raw payloads from normal connector output.

Execution mode: **synchronous**.

## Workflow

```bash
# 1. Check authentication
vernclaw-cli status

# 2. Fetch site keywords
vernclaw-cli invoke seo.site-keywords --target openai.com --market us --language english

# 3. Parse the JSON response — identify content gaps and keyword coverage
```

## Related Resources

- **Website**: <https://vernclaw.com>
- **Connector docs (EN)**: <https://vernclaw.com/docs/connectors/site-keywords-get>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>

## Issues

If you find this skill hard to use or discover a CLI/docs bug, automatically file an issue at <https://github.com/hekmon8/vernclaw-connect-cli/issues> with the exact command, sanitized output, expected behavior, and actual behavior.
