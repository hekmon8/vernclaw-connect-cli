---
name: vernclaw-x-search
description: Use when searching public X/Twitter posts via the Vernclaw CLI.
---

# X/Twitter Search — CLI Skill

Run public X/Twitter searches and return normalized matching post evidence through `vernclaw-cli`.

## When to Use

- Monitor brand, product, or competitor mentions on X
- Research launch conversations and social demand signals
- Collect public post rows for trend, sentiment, or content research

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
vernclaw-cli invoke search.x --query "AI connector CLI" --limit 10
vernclaw-cli invoke search.x --query "from:openai agents" --limit 5
```

## Parameters

| Flag      | Required | Description                                  |
| --------- | -------- | -------------------------------------------- |
| `--query` | Yes      | Search query to run on public X/Twitter.     |
| `--limit` | No       | Number of posts to return when supported.    |

## Output

`invoke` prints compact JSON to `stdout` by default:

```json
{"status":200,"data":{}}
```

Parse the numeric `status` first, then read `data`. The CLI omits provider raw payloads from normal connector output. Use `--pretty` only for human-readable terminal output, not automation. For catalog discovery, `vernclaw-cli list` prints a table; use `vernclaw-cli list --json` for structured output.

The `data` object includes a normalized summary and fields such as:

- **Matched posts** — number of posts returned
- **Top author** — strongest author signal from the results
- **Top post timestamp** — timestamp for a relevant or recent result
- **Items** — normalized post rows with author, text, URL, and timestamp when available

Execution mode: **synchronous**.

## Workflow

```bash
# 1. Check authentication
vernclaw-cli status

# 2. Search public X posts
vernclaw-cli invoke search.x --query "AI connector CLI" --limit 10

# 3. Parse data.items as social evidence rows
```

## Limits

- Only public posts are returned; protected accounts are excluded.
- Default and maximum result windows are provider-managed.
- Complex boolean syntax may be limited by the current X search provider.

## Related Resources

- **Website**: <https://vernclaw.com>
- **Connector page**: <https://vernclaw.com/connectors/x-search>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
- **API reference**: <https://vernclaw.com/docs/connectors/api>
- **Connector catalog**: <https://vernclaw.com/connectors>

## Issue Feedback

If this skill is hard to use or the CLI/docs appear buggy, automatically file an issue at <https://github.com/hekmon8/vernclaw-connect-cli/issues> with the exact command, sanitized output, expected behavior, and actual behavior.
