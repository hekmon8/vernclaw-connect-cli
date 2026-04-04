---
name: domain-whois-get
description: Use when checking public domain registration timestamps, registrar details, or due-diligence signals through the Vernclaw CLI.
---

# Whois Lookup — CLI Skill

Inspect a domain's public registration snapshot through `vernclaw-cli`.

## When to Use

- Check registrar and expiry before acquisition
- Review public timestamps for due diligence
- Monitor domain registration hygiene
- Feed Whois snapshots into AI research notes

## Prerequisites

```bash
npm i -g vernclaw-connect-cli
vernclaw-cli login
```

## Invocation

```bash
vernclaw-cli invoke seo.domain-whois --target openai.com
```

## Parameters

| Flag       | Required | Description            |
| ---------- | -------- | ---------------------- |
| `--target` | Yes      | Root domain to inspect |

## Output

Markdown to `stdout` containing `Domain`, `Registrar`, `Created`, `Expires`, and `Updated`.

Execution mode: **synchronous**.
