---
name: site-technologies-get
description: Use when detecting a site's public stack, planning migrations, or qualifying technical leads through the Vernclaw CLI.
---

# Site Technologies — CLI Skill

Detect a site's public technology stack through `vernclaw-cli`.

## When to Use

- Review a competitor’s public stack
- Plan a migration based on visible tooling
- Qualify leads by detected technologies
- Prepare a technical snapshot for AI analysis

## Prerequisites

```bash
npm i -g vernclaw-connect-cli
vernclaw-cli login
```

## Invocation

```bash
vernclaw-cli invoke seo.site-technologies --target openai.com
```

## Parameters

| Flag       | Required | Description            |
| ---------- | -------- | ---------------------- |
| `--target` | Yes      | Root domain to inspect |

## Output

JSON to `stdout` with `status` and `data`. The `data` object includes a normalized summary, the named fields, and the full upstream `raw` payload. It summarizes `Target`, `Detected Technologies`, and `Top Technology`.

Execution mode: **synchronous**.
