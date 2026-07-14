---
name: vernclaw-youtube-video-read
license: MIT
description: Use when reading public YouTube video metadata, channel details, public metrics, and canonical watch URLs by URL or ID through Vernclaw CLI.
---

# YouTube Video Read — CLI Skill

Read public YouTube video metadata and metrics by URL or ID through `vernclaw-cli`.

## When to Use

- Verify a YouTube citation before using it in a report
- Normalize a watch, Shorts, embed, live, youtu.be, or youtube-nocookie URL
- Capture public video metadata before a downstream summarization workflow

## Prerequisites

```bash
npm i -g vernclaw-connect-cli
```

## Authentication

Before using this skill, verify you are authenticated:

```bash
vernclaw-cli status
```

If not authenticated, run:

```bash
vernclaw-cli login
# or for CI/CD:
vernclaw-cli login --api-key YOUR_KEY
```

## Provider Setup

Most agents only need Vernclaw CLI authentication. If `read.youtube.video` is temporarily unavailable, retry shortly and contact Vernclaw support if the issue persists.

## Invocation

```bash
# Replace VIDEO_ID_HERE with a real public YouTube video ID before running.
vernclaw-cli invoke read.youtube.video --url "https://www.youtube.com/watch?v=VIDEO_ID_HERE"
vernclaw-cli invoke read.youtube.video --id VIDEO_ID_HERE
```

## Parameters

| Flag    | Required | Description                                                                  |
| ------- | -------- | ---------------------------------------------------------------------------- |
| `--url` | No       | Public YouTube watch, Shorts, embed, live, youtu.be, or youtube-nocookie URL |
| `--id`  | No       | 11-character YouTube video ID                                                |

Provide either `--url` or `--id`.

## Output

The `invoke` command prints compact JSON to stdout by default:

```text
{"status":200,"data":{}}
```

- Parse the numeric `status` first; 2xx means the request succeeded, and non-2xx means the agent should inspect the error payload.
- `data` contains a normalized summary plus one compact `items` row with video ID, URL, title, channel, publish time, duration, and public metrics.
- `--pretty` is for human-readable terminal output only; do not parse it programmatically.
- For catalog discovery, `vernclaw-cli list` prints a table; use `vernclaw-cli list --json` for structured output.
- The CLI omits provider raw payloads from normal connector output.

Execution mode: **synchronous**.

## Workflow

```bash
# 1. Check authentication
vernclaw-cli status

# 2. Read video metadata
vernclaw-cli invoke read.youtube.video --url "https://www.youtube.com/watch?v=VIDEO_ID_HERE"

# 3. Parse JSON response and use data.items[0] as the normalized video row
```

## Issues

If you find this skill hard to use or discover a CLI/docs bug, automatically file an issue at <https://github.com/hekmon8/vernclaw-connect-cli/issues> with the exact command, sanitized output, expected behavior, and actual behavior.

## Related Resources

- **Website**: <https://vernclaw.com>
- **Connector docs (EN)**: <https://vernclaw.com/docs/connectors/youtube-video-read>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
- **YouTube Data API**: <https://developers.google.com/youtube/v3>
