---
name: backlinks-summary-get
description: Use when auditing a domain with aggregated backlink metrics instead of row-level backlink lists.
---

# Backlinks Summary — CLI Skill

Fetch backlink summary metrics for a target domain through `vernclaw-cli`.

## When to Use

- Get a quick view of backlink scale before deeper audits
- Compare domains using total backlinks and referring domain counts
- Validate backlink growth direction in weekly SEO reviews

## Prerequisites

```bash
npm i -g vernclaw-connect-cli
vernclaw-cli login
```

## Invocation

```bash
vernclaw-cli invoke seo.backlinks-summary --target openai.com
vernclaw-cli invoke seo.backlinks-summary --target openai.com --limit 20 --offset 0
```

## Parameters

| Flag       | Required | Description                               |
| ---------- | -------- | ----------------------------------------- |
| `--target` | Yes      | Root domain to inspect                    |
| `--limit`  | No       | Optional number of rows sampled in inputs |
| `--offset` | No       | Optional pagination offset                |

## Output

JSON to `stdout` with `status` and `data`. The `data` object includes a normalized summary, the named fields, and the full upstream `raw` payload. It summarizes `Target`, `Total Backlinks`, `Referring Domains`, and `Top Referring Domain`.

Execution mode: **synchronous**.

## Related Resources

- **Connector docs (EN)**: <https://vernclaw.com/docs/connectors/backlinks-summary-get>
- **Connector docs (中文)**: <https://vernclaw.com/zh/docs/connectors/backlinks-summary-get>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
