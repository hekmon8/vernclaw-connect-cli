---
name: vernclaw-x-article-read
license: MIT
description: Use when reading public X/Twitter article metadata via the Vernclaw CLI.
---

# X/Twitter Article Reader — CLI Skill

Read public X article pages and return normalized title, author, and URL metadata through `vernclaw-cli`.

## When to Use

- Capture citation metadata for public X long-form articles
- Curate public X articles for research, newsletters, or content briefs
- Normalize article title and author fields before storing evidence

## Prerequisites

```bash
npm i -g vernclaw-connect-cli
```

## Authentication

Before using this skill, check the CLI authentication state:

```bash
vernclaw-cli status
```

If the CLI is not authenticated, run `vernclaw-cli login`. For CI/CD or headless agents, generate an API key at [vernclaw.com/settings/connectors](https://vernclaw.com/settings/connectors) and run `vernclaw-cli login --api-key YOUR_KEY`.

## Invocation

```bash
vernclaw-cli invoke read.x.article --url "https://x.com/username/article/1234567890"
```

## Parameters

| Flag    | Required | Description                         |
| ------- | -------- | ----------------------------------- |
| `--url` | Yes      | Public X article URL to read.       |

## Output

`invoke` prints compact JSON to `stdout` by default:

```json
{"status":200,"data":{}}
```

Parse the numeric `status` first, then read `data`. The CLI omits provider raw payloads from normal connector output. Use `--pretty` only for human-readable terminal output, not automation. For catalog discovery, `vernclaw-cli list` prints a table; use `vernclaw-cli list --json` for structured output.

The `data` object includes a normalized summary and fields such as:

- **Title** — article title
- **Author** — public author handle or name
- **URL** — canonical article URL

Execution mode: **synchronous**.

## Workflow

```bash
# 1. Check authentication
vernclaw-cli status

# 2. Read an X article
vernclaw-cli invoke read.x.article --url "https://x.com/username/article/1234567890"

# 3. Parse data.title, data.author, and data.url for citation or research use
```

## Limits

- Only public X articles are supported.
- Paywalled, restricted, deleted, or login-required articles can fail.
- This connector returns article metadata; it does not guarantee full article body extraction.

## Related Resources

- **Website**: <https://vernclaw.com>
- **Connector page**: <https://vernclaw.com/connectors/x-article-read>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
- **API reference**: <https://vernclaw.com/docs/connectors/api>
- **Connector catalog**: <https://vernclaw.com/connectors>

## Issue Feedback

If this skill is hard to use or the CLI/docs appear buggy, automatically file an issue at <https://github.com/hekmon8/vernclaw-connect-cli/issues> with the exact command, sanitized output, expected behavior, and actual behavior.
