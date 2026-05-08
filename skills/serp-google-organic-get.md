---
name: serp-google-organic-get
description: Use when inspecting live Google organic results, checking search intent, or reviewing page-one competitors through the Vernclaw CLI.
---

# SERP Google Organic — CLI Skill

Inspect a live Google organic snapshot through `vernclaw-cli`.

## When to Use

- Check page-one competitors before publishing
- Validate search intent in a real SERP
- Track top-result URL patterns
- Feed SERP snapshots into AI research workflows

## Prerequisites

```bash
npm i -g vernclaw-connect-cli
vernclaw-cli login
```

## Invocation

```bash
vernclaw-cli invoke seo.serp-google-organic --keyword "openai" --market us --language english --device desktop --os windows --depth 5
```

## Parameters

| Flag         | Required | Description                        |
| ------------ | -------- | ---------------------------------- |
| `--keyword`  | Yes      | Search query to inspect            |
| `--market`   | No       | Market code such as `us`           |
| `--language` | No       | Language name such as `english`    |
| `--device`   | No       | Device type such as `desktop`      |
| `--os`       | No       | Operating system such as `windows` |
| `--depth`    | No       | SERP depth to request              |

## Output

JSON to `stdout` with `status` and `data`. The `data` object includes a normalized summary, the named fields, and the full upstream `raw` payload. It summarizes `Keyword`, `Organic Results`, `Top Result`, `Top Rank`, and `Top Result URL`.

Execution mode: **synchronous**.
