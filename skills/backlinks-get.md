---
name: backlinks-get
description: Use when checking live backlink rows for a domain, reviewing referring pages, or quickly auditing off-page SEO via the Vernclaw CLI.
---

# Backlinks Checker — CLI Skill

Fetch live backlink rows for a target domain through `vernclaw-cli`.

## When to Use

- Review referring pages before link cleanup
- Spot off-page SEO opportunities for a competitor
- Sample backlink quality without opening another tool
- Feed backlink rows into an AI research workflow

## Prerequisites

```bash
npm i -g vernclaw-connect-cli
vernclaw-cli login
```

## Invocation

```bash
vernclaw-cli invoke seo.backlinks --target example.com
vernclaw-cli invoke seo.backlinks --target example.com --limit 10
```

## Parameters

| Flag       | Required | Description                                |
| ---------- | -------- | ------------------------------------------ |
| `--target` | Yes      | Root domain to inspect                     |
| `--limit`  | No       | Optional number of backlink rows to return |

## Output

Markdown to `stdout` containing sampled backlink rows, referring domains, and rank-like signals when available.

Execution mode: **synchronous**.

## Related Resources

- **Connector docs (EN)**: <https://vernclaw.com/docs/connectors/backlinks-get>
- **Connector docs (中文)**: <https://vernclaw.com/zh/docs/connectors/backlinks-get>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
