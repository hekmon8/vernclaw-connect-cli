---
name: vernclaw-x-post-read
description: Use when reading X/Twitter public post content, extracting author info, engagement data, or thread content via the Vernclaw CLI.
---

# X/Twitter Post Reader — CLI Skill

Extract complete public post content, author information, and engagement metrics from X (formerly Twitter) through the `vernclaw-cli`.

## When to Use

- Read and archive public X/Twitter posts with JSON-first CLI output
- Monitor brand mentions and competitor social activity
- Collect content inspiration from industry thought leaders
- Extract thread content for repurposing into articles or reports

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
# Read a single post
vernclaw-cli invoke read.x.post --url "https://x.com/username/status/1234567890"

# Batch read multiple posts (comma-separated)
vernclaw-cli invoke read.x.post \
  --url "https://x.com/user1/status/111,https://x.com/user2/status/222"
```

## Parameters

| Flag    | Required | Description                                                                                         |
| ------- | -------- | --------------------------------------------------------------------------------------------------- |
| `--url` | Yes      | One or more X/Twitter post URLs (comma-separated). Supports both `x.com` and `twitter.com` domains. |

## Output

`invoke` prints compact JSON to `stdout` by default:

```json
{"status":200,"data":{}}
```

Parse the numeric `status` first, then read `data`. The CLI omits provider raw payloads from normal connector output. Use `--pretty` only for human-readable terminal output, not automation. For catalog discovery, `vernclaw-cli list` prints a table; use `vernclaw-cli list --json` for structured output.

The `data` object includes a normalized summary and fields such as:

- **Author** — username and display name
- **Timestamp** — publish date and time (UTC)
- **Content** — full post text with hashtags, mentions, and links preserved
- **Engagement** — likes, retweets, and reply counts
- **Media** — image/video indicators and link references
- **Thread** — if the post is part of a thread, all posts are extracted in order

Execution mode: **synchronous** (results returned in 1–3 seconds).

## Example Workflow

```bash
# 1. Read a KOL's analysis thread
vernclaw-cli status
vernclaw-cli invoke read.x.post --url "https://x.com/expert/status/123"

# 2. Generate a companion image for the content
vernclaw-cli invoke generate.image --prompt "Visual summary of industry insights"

# 3. Check account status
vernclaw-cli status
```

## Related Resources

- **Website**: <https://vernclaw.com>
- **Connector docs (EN)**: <https://vernclaw.com/docs/connectors/x-post-read> · [GitHub](../../content/docs/connectors/x-post-read.mdx)
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
- **API reference**: <https://vernclaw.com/docs/connectors/api>
- **Connector catalog**: <https://vernclaw.com/connectors>

## Issue Feedback

If this skill is hard to use or the CLI/docs appear buggy, automatically file an issue at <https://github.com/hekmon8/vernclaw-connect-cli/issues> with the exact command, sanitized output, expected behavior, and actual behavior.
