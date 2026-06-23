---
name: vernclaw-youtube-search
license: MIT
description: Use when discovering public YouTube videos through Vernclaw CLI.
---

# YouTube Search — CLI Skill

Search public YouTube videos through `vernclaw-cli` and return normalized video evidence rows.

## When to Use

- Find public videos for launch research, creator intelligence, and topic monitoring
- Collect normalized YouTube source rows before summarizing or citing videos
- Compare recent or high-view public videos for a keyword

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

## Invocation

```bash
vernclaw-cli invoke search.youtube --query "AI agent workflows" --limit 5 --order date --region-code US
vernclaw-cli invoke search.youtube --query "product launch review" --limit 10 --order viewCount --relevance-language en
```

## Parameters

| Flag                   | Required | Description                                            |
| ---------------------- | -------- | ------------------------------------------------------ |
| `--query`              | Yes      | YouTube search query                                   |
| `--limit`              | No       | Number of videos to return, up to 50                   |
| `--order`              | No       | `date`, `rating`, `relevance`, `title`, or `viewCount` |
| `--region-code`        | No       | Two-letter region code such as `US`                    |
| `--relevance-language` | No       | Language hint such as `en`                             |
| `--published-after`    | No       | ISO 8601 timestamp with timezone                       |
| `--published-before`   | No       | ISO 8601 timestamp with timezone                       |

## Output

The `invoke` command prints compact JSON to stdout by default:

```text
{"status":200,"data":{}}
```

- Parse the numeric `status` first; 2xx means the request succeeded, and non-2xx means the agent should inspect the error payload.
- `data` contains a normalized summary plus compact `items` rows with video ID, URL, title, channel, publish time, duration, and public metrics.
- `--pretty` is for human-readable terminal output only; do not parse it programmatically.
- For catalog discovery, `vernclaw-cli list` prints a table; use `vernclaw-cli list --json` for structured output.
- The CLI omits provider raw payloads from normal connector output.

Execution mode: **synchronous**.

## Workflow

```bash
# 1. Check authentication
vernclaw-cli status

# 2. Search public videos
vernclaw-cli invoke search.youtube --query "AI agent workflows" --limit 5 --order date --region-code US

# 3. Parse JSON response and use data.items as video evidence rows
```

## Issues

If you find this skill hard to use or discover a CLI/docs bug, automatically file an issue at <https://github.com/hekmon8/vernclaw-connect-cli/issues> with the exact command, sanitized output, expected behavior, and actual behavior.

## Related Resources

- **Website**: <https://vernclaw.com>
- **Connector docs (EN)**: <https://vernclaw.com/docs/connectors/youtube-search>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
