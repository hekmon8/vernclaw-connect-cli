---
name: keyword-search-volume-get
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
vernclaw-cli login
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

Markdown to `stdout` containing `Keywords Queried`, `Top Keyword`, `Search Volume`, `Competition`, and `Competition Index`.

Execution mode: **synchronous**.

## Related Resources

- **Connector docs (EN)**: <https://vernclaw.com/docs/connectors/keyword-search-volume-get>
- **Connector docs (中文)**: <https://vernclaw.com/zh/docs/connectors/keyword-search-volume-get>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
