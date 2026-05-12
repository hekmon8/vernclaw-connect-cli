---
name: google-trends-get
description: Use when assessing keyword momentum and trend direction through Vernclaw CLI.
---

# Google Trends Get — CLI Skill

Fetch trend exploration data for one or more keywords through `vernclaw-cli`.

## When to Use

- Validate whether demand for a topic is rising or fading
- Compare keyword momentum before building campaign calendars
- Feed trend signals into SEO content and AI planning workflows

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
vernclaw-cli invoke seo.google-trends --keywords "openai,chatgpt" --market us --language english
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
- `data` contains a normalized summary with fields such as `keywords_queried`, `trend_points`, `top_trend_value`, `average_trend_value`, `date_range`, and row counts for regions/topics/queries.
- `--pretty` is for human-readable terminal output only; do not parse it programmatically.
- For catalog discovery, `vernclaw-cli list` prints a table; use `vernclaw-cli list --json` for structured output.
- The CLI omits provider raw payloads from normal connector output.

Execution mode: **synchronous**.

## Workflow

```bash
# 1. Check authentication
vernclaw-cli status

# 2. Fetch trend data
vernclaw-cli invoke seo.google-trends --keywords "openai,chatgpt" --market us --language english

# 3. Parse the JSON response — extract trend direction and momentum
```

## Issues

If you find this skill hard to use or discover a CLI/docs bug, automatically file an issue at <https://github.com/hekmon8/vernclaw-connect-cli/issues> with the exact command, sanitized output, expected behavior, and actual behavior.

## Related Resources

- **Website**: <https://vernclaw.com>
- **Connector docs (EN)**: <https://vernclaw.com/docs/connectors/google-trends-get>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
