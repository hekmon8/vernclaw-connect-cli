---
name: vernclaw-x-post-replies-read
description: Use when reading public replies for an X/Twitter post via the Vernclaw CLI.
---

# X/Twitter Post Replies Reader — CLI Skill

Read public replies for a referenced X/Twitter post through `vernclaw-cli`.

## When to Use

- Analyze audience reactions to a public X/Twitter post
- Collect reply volume and recent conversation evidence
- Find active commenters around a product announcement or launch post

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
vernclaw-cli invoke read.x.replies --url "https://x.com/username/status/1234567890"
```

## Parameters

| Flag    | Required | Description                                      |
| ------- | -------- | ------------------------------------------------ |
| `--url` | Yes      | Direct public X/Twitter post URL to inspect.     |

## Output

`invoke` prints compact JSON to `stdout` by default:

```json
{"status":200,"data":{}}
```

Parse the numeric `status` first, then read `data`. The CLI omits provider raw payloads from normal connector output. Use `--pretty` only for human-readable terminal output, not automation. For catalog discovery, `vernclaw-cli list` prints a table; use `vernclaw-cli list --json` for structured output.

The `data` object includes a normalized summary and fields such as:

- **Reply count** — number of public replies fetched
- **Top reply author** — author signal from the most relevant or engaged reply
- **Latest reply timestamp** — newest reply time when available
- **Items** — compact public reply rows when returned by the provider

Execution mode: **synchronous**.

## Workflow

```bash
# 1. Check authentication
vernclaw-cli status

# 2. Read public replies for a post
vernclaw-cli invoke read.x.replies --url "https://x.com/username/status/1234567890"

# 3. Parse the JSON response and use data as conversation evidence
```

## Limits

- Only public replies are returned.
- Replies from protected accounts, deleted replies, login-only content, and unavailable posts are excluded.
- Very active posts may return a recent or provider-limited reply window rather than every historical reply.

## Related Resources

- **Website**: <https://vernclaw.com>
- **Connector page**: <https://vernclaw.com/connectors/x-post-replies-read>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
- **API reference**: <https://vernclaw.com/docs/connectors/api>
- **Connector catalog**: <https://vernclaw.com/connectors>

## Issue Feedback

If this skill is hard to use or the CLI/docs appear buggy, automatically file an issue at <https://github.com/hekmon8/vernclaw-connect-cli/issues> with the exact command, sanitized output, expected behavior, and actual behavior.
