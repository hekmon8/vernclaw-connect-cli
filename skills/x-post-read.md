---
name: x-post-read
description: Use when reading X/Twitter public post content, extracting author info, engagement data, or thread content via the Vernclaw CLI.
---

# X/Twitter Post Reader — CLI Skill

Extract complete public post content, author information, and engagement metrics from X (formerly Twitter) through the `vernclaw-cli`.

## When to Use

- Read and archive public X/Twitter posts in Markdown
- Monitor brand mentions and competitor social activity
- Collect content inspiration from industry thought leaders
- Extract thread content for repurposing into articles or reports

## Prerequisites

```bash
npm i -g vernclaw-connect-cli
vernclaw-cli login
```

If you need an API key for CI/CD, generate one at [vernclaw.com/settings/connectors](https://vernclaw.com/settings/connectors) and run `vernclaw-cli login --api-key YOUR_KEY`.

## Invocation

```bash
# Read a single post
vernclaw-cli invoke read.x.post --url "https://x.com/username/status/1234567890"

# Batch read multiple posts (comma-separated)
vernclaw-cli invoke read.x.post \
  --url "https://x.com/user1/status/111,https://x.com/user2/status/222"
```

## Parameters

| Flag | Required | Description |
|------|----------|-------------|
| `--url` | Yes | One or more X/Twitter post URLs (comma-separated). Supports both `x.com` and `twitter.com` domains. |

## Output

Markdown to `stdout` containing:

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
vernclaw-cli invoke read.x.post --url "https://x.com/expert/status/123"

# 2. Generate a companion image for the content
vernclaw-cli invoke generate.image --prompt "Visual summary of industry insights"

# 3. Check account status
vernclaw-cli status
```

## Related Resources

- **Connector docs (EN)**: <https://vernclaw.com/docs/connectors/x-post-read> · [GitHub](../../content/docs/connectors/x-post-read.mdx)
- **Connector docs (中文)**: <https://vernclaw.com/zh/docs/connectors/x-post-read> · [GitHub](../../content/docs/connectors/x-post-read.zh.mdx)
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
- **API reference**: <https://vernclaw.com/docs/connectors/api>
- **Connector catalog**: <https://vernclaw.com/connectors>
