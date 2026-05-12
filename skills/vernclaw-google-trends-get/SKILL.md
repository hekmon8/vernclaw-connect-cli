---
name: vernclaw-google-trends-get
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
vernclaw-cli invoke seo.google-trends --keywords "translator" --market us --language english --time-range past_7_days --type web --item-types google_trends_queries_list
```

## Parameters

| Flag              | Required | Description                                                                                                                       |
| ----------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `--keywords`      | Yes      | Seed keyword or comma-separated keyword list. Use one keyword for related rows.                                                   |
| `--market`        | No       | Market code such as `us`                                                                                                          |
| `--language`      | No       | Language name such as `english`                                                                                                   |
| `--time-range`    | No       | Preset range such as `past_7_days`, `past_30_days`, or `past_12_months`                                                           |
| `--date-from`     | No       | Custom start date in `YYYY-MM-DD` format. Takes precedence over time range when used with `--date-to`.                            |
| `--date-to`       | No       | Custom end date in `YYYY-MM-DD` format                                                                                            |
| `--type`          | No       | Search type: `web`, `news`, `youtube`, `images`, or `froogle`                                                                     |
| `--category-code` | No       | Google Trends category code, default `0`                                                                                          |
| `--item-types`    | No       | Comma-separated item types: `google_trends_graph`, `google_trends_map`, `google_trends_topics_list`, `google_trends_queries_list` |
| `--points`        | No       | Number of graph points to include in normalized `series`; defaults to `20`                                                        |
| `--all`           | No       | Return all normalized graph points                                                                                                |

## Output

The `invoke` command prints compact JSON to stdout by default:

```text
{"status":200,"data":{}}
```

- Parse the numeric `status` first; 2xx means the request succeeded or was accepted, and non-2xx means the agent should inspect the error payload.
- `data` contains a normalized summary with fields such as `date_range`, `trend_point_count`, `latest_interest`, `avg_interest`, `series`, and, when requested, `related_queries.top/rising` and `related_topics.top/rising`.
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

# Compare keyword momentum over a short window
vernclaw-cli invoke seo.google-trends --keywords "mcp server,translator" --market us --language english --time-range past_30_days --item-types google_trends_graph

# Mine rising related queries for one root keyword
vernclaw-cli invoke seo.google-trends --keywords "translator" --market us --language english --time-range past_7_days --type web --item-types google_trends_queries_list

# Use a custom date range
vernclaw-cli invoke seo.google-trends --keywords "translator" --market us --language english --date-from 2026-05-01 --date-to 2026-05-12 --item-types google_trends_queries_list

# 3. Parse the JSON response — extract trend direction and momentum
```

## Issues

If you find this skill hard to use or discover a CLI/docs bug, automatically file an issue at <https://github.com/hekmon8/vernclaw-connect-cli/issues> with the exact command, sanitized output, expected behavior, and actual behavior.

## Related Resources

- **Website**: <https://vernclaw.com>
- **Connector docs (EN)**: <https://vernclaw.com/docs/connectors/google-trends-get>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
