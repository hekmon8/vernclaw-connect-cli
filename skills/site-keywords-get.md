---
name: site-keywords-get
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
vernclaw-cli login
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

JSON to `stdout` with `status` and `data`. The `data` object includes a normalized summary, the named fields, and the full upstream `raw` payload. It summarizes `Target`, `Fetched Keywords`, `Top Keyword`, and `Top Keyword Volume`.

Execution mode: **synchronous**.
