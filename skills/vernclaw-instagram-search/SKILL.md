---
name: vernclaw-instagram-search
license: MIT
description: Use when running Instagram Search through Vernclaw's CLI.
---

# Instagram Search — CLI Skill

Search public Instagram posts and Reels through Vernclaw CLI and return normalized evidence rows.

## When to Use

- Find public Instagram posts or Reels for trend research
- Search hashtags before reading a specific post URL
- Collect creator or topic evidence for agent workflows

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
vernclaw-cli invoke search.instagram --query "AI tools" --limit 5
vernclaw-cli invoke search.instagram --query "AI tools" --hashtag aitools
vernclaw-cli describe search.instagram
```

## Parameters

| Flag        | Required | Description                               |
| ----------- | -------- | ----------------------------------------- |
| `--query`   | Yes      | Keyword query to search Instagram posts.  |
| `--hashtag` | No       | Optional hashtag to search without #.     |
| `--limit`   | No       | Number of posts to return when supported. |

## Output

`invoke` prints compact JSON to `stdout` by default:

```json
{"status":200,"data":{}}
```

Parse the numeric `status` first, then read `data`. The CLI omits provider raw payloads from normal connector output. Use `--pretty` only for human-readable terminal output, not automation. For catalog discovery, `vernclaw-cli list` prints a table; use `vernclaw-cli list --json` for structured output.

The `data` object includes normalized summary fields and result rows when available.

Execution mode: **synchronous**.

## Workflow

```bash
# 1. Check authentication
vernclaw-cli status

# 2. Inspect the connector schema
vernclaw-cli describe search.instagram

# 3. Run the connector
vernclaw-cli invoke search.instagram --query "AI tools" --limit 5
```

## Limits

- Only public provider-accessible content is returned.
- Results can vary by upstream availability and platform restrictions.
- The normal connector output omits full upstream raw payloads.

## Related Resources

- **Website**: <https://vernclaw.com>
- **Connector page**: <https://vernclaw.com/connectors/instagram-search>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
- **API reference**: <https://vernclaw.com/docs/connectors/api>
- **Connector catalog**: <https://vernclaw.com/connectors>

## Issue Feedback

If this skill is hard to use or the CLI/docs appear buggy, automatically file an issue at <https://github.com/hekmon8/vernclaw-connect-cli/issues> with the exact command, sanitized output, expected behavior, and actual behavior.
