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
vernclaw-cli login
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

JSON to `stdout` with `status` and `data`. The `data` object includes normalized Google Trends fields such as `Keywords Queried`, `Result Item Types`, `Trend Points`, `Top Trend Value`, `Average Trend Value`, `Date Range`, `Latest Date`, `Latest Values`, row counts for regions/topics/queries, and the full upstream `raw` payload.

Execution mode: **synchronous**.

## Related Resources

- **Connector docs (EN)**: <https://vernclaw.com/docs/connectors/google-trends-get>
- **Connector docs (中文)**: <https://vernclaw.com/zh/docs/connectors/google-trends-get>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
