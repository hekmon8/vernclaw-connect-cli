---
name: vernclaw-tiktok-search
license: MIT
description: Use when running TikTok Search through Vernclaw's CLI.
---

# TikTok Search — CLI Skill

Search public TikTok videos through Vernclaw CLI and return normalized video evidence rows.

## When to Use

- Find public TikTok videos for social listening or creator research
- Collect video evidence rows before reading a specific TikTok URL
- Compare TikTok discovery signals with YouTube or Instagram research

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

This connector is currently not available in the offline catalog.

## Parameters

| Flag        | Required | Description                                |
| ----------- | -------- | ------------------------------------------ |
| `--query`   | Yes      | Keyword query to search TikTok videos.     |
| `--hashtag` | No       | Optional hashtag to search without #.      |
| `--limit`   | No       | Number of videos to return when supported. |

## Output

`invoke` prints compact JSON to `stdout` by default:

```json
{"status":200,"data":{}}
```

Parse the numeric `status` first, then read `data`. The CLI omits provider raw payloads from normal connector output. Use `--pretty` only for human-readable terminal output, not automation. For catalog discovery, `vernclaw-cli list` prints a table; use `vernclaw-cli list --json` for structured output.

The `data` object includes normalized summary fields and result rows when available.

Execution mode: **synchronous**.

## Workflow

This connector is currently not available in the offline catalog.
## Limits

- Only public provider-accessible content is returned.
- Results can vary by upstream availability and platform restrictions.
- The normal connector output omits full upstream raw payloads.

## Related Resources

- **Website**: <https://vernclaw.com>
- **Connector page**: <https://vernclaw.com/connectors/tiktok-search>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
- **API reference**: <https://vernclaw.com/docs/connectors/api>
- **Connector catalog**: <https://vernclaw.com/connectors>

## Issue Feedback

If this skill is hard to use or the CLI/docs appear buggy, automatically file an issue at <https://github.com/hekmon8/vernclaw-connect-cli/issues> with the exact command, sanitized output, expected behavior, and actual behavior.
