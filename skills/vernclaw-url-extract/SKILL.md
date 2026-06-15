---
name: vernclaw-url-extract
description: Use when extracting readable content from a public URL via the Vernclaw CLI.
---

# URL Extract — CLI Skill

Extract readable main content from Xiaohongshu, WeChat, and other public web pages through `vernclaw-cli`.

## When to Use

- Extract main article or note content before summarization
- Convert public web pages into readable Markdown-like evidence
- Chain web search results into content extraction workflows

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
vernclaw-cli invoke extract.url --url "https://example.com/article"
vernclaw-cli invoke extract.url --url "https://www.xiaohongshu.com/explore/abcd1234"
```

## Parameters

| Flag    | Required | Description                         |
| ------- | -------- | ----------------------------------- |
| `--url` | Yes      | Public URL to extract.              |

## Output

`invoke` prints compact JSON to `stdout` by default:

```json
{"status":200,"data":{}}
```

Parse the numeric `status` first, then read `data`. The CLI omits provider raw payloads from normal connector output. Use `--pretty` only for human-readable terminal output, not automation. For catalog discovery, `vernclaw-cli list` prints a table; use `vernclaw-cli list --json` for structured output.

The `data` object includes a normalized summary and fields such as:

- **Title** — extracted page title
- **URL** — canonical or resolved page URL
- **Content length** — character count for extracted readable content
- **Content** — readable main content when returned by the provider

Execution mode: **synchronous**.

## Workflow

```bash
# 1. Check authentication
vernclaw-cli status

# 2. Extract a public URL
vernclaw-cli invoke extract.url --url "https://example.com/article"

# 3. Parse data.content or normalized summary for downstream analysis
```

## Limits

- Login-required, CAPTCHA-protected, deleted, or blocked pages can fail.
- Very large pages may be truncated.
- Dynamic pages that require extensive browser rendering may return incomplete content.

## Related Resources

- **Website**: <https://vernclaw.com>
- **Connector page**: <https://vernclaw.com/connectors/url-extract>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
- **API reference**: <https://vernclaw.com/docs/connectors/api>
- **Connector catalog**: <https://vernclaw.com/connectors>

## Issue Feedback

If this skill is hard to use or the CLI/docs appear buggy, automatically file an issue at <https://github.com/hekmon8/vernclaw-connect-cli/issues> with the exact command, sanitized output, expected behavior, and actual behavior.
