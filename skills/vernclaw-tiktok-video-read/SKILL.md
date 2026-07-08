---
name: vernclaw-tiktok-video-read
license: MIT
description: Use when running TikTok Video Read through Vernclaw's CLI.
---

# TikTok Video Read — CLI Skill

Read a public TikTok video by URL and return normalized metadata and metrics.

## When to Use

- Extract public metadata from a known TikTok video URL
- Attach metrics and author data to a research note
- Verify a TikTok source before quoting it in an agent report

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

**Note:** The `read.tiktok.video` connector is currently not available in the offline catalog. The following examples are preserved for reference when this connector becomes available.

```bash
# vernclaw-cli invoke read.tiktok.video --url "https://www.tiktok.com/@user/video/1234567890"
# vernclaw-cli describe read.tiktok.video
```

## Parameters

| Flag    | Required | Description              |
| ------- | -------- | ------------------------ |
| `--url` | Yes      | Public TikTok video URL. |

## Output

`invoke` prints compact JSON to `stdout` by default:

```json
{"status":200,"data":{}}
```

Parse the numeric `status` first, then read `data`. The CLI omits provider raw payloads from normal connector output. Use `--pretty` only for human-readable terminal output, not automation. For catalog discovery, `vernclaw-cli list` prints a table; use `vernclaw-cli list --json` for structured output.

The `data` object includes normalized summary fields and result rows when available.

Execution mode: **synchronous**.

## Workflow

**Note:** The `read.tiktok.video` connector is currently not available in the offline catalog. The following workflow is preserved for reference when this connector becomes available.

```bash
# 1. Check authentication
vernclaw-cli status

# 2. Inspect the connector schema
# vernclaw-cli describe read.tiktok.video

# 3. Run the connector
# vernclaw-cli invoke read.tiktok.video --url "https://www.tiktok.com/@user/video/1234567890"
```

## Limits

- Only public provider-accessible content is returned.
- Results can vary by upstream availability and platform restrictions.
- The normal connector output omits full upstream raw payloads.

## Related Resources

- **Website**: <https://vernclaw.com>
- **Connector page**: <https://vernclaw.com/connectors/tiktok-video-read>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
- **API reference**: <https://vernclaw.com/docs/connectors/api>
- **Connector catalog**: <https://vernclaw.com/connectors>

## Issue Feedback

If this skill is hard to use or the CLI/docs appear buggy, automatically file an issue at <https://github.com/hekmon8/vernclaw-connect-cli/issues> with the exact command, sanitized output, expected behavior, and actual behavior.
