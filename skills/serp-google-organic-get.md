---
name: serp-google-organic-get
description: Use when inspecting live Google organic results, checking search intent, or reviewing page-one competitors through the Vernclaw CLI.
---

# SERP Google Organic — CLI Skill

Inspect a live Google organic snapshot through `vernclaw-cli`.

## When to Use

- Check page-one competitors before publishing
- Validate search intent in a real SERP
- Track top-result URL patterns
- Feed SERP snapshots into AI research workflows

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
vernclaw-cli invoke seo.serp-google-organic --keyword "openai" --market us --language english --device desktop --os windows --depth 5
```

## Parameters

| Flag         | Required | Description                        |
| ------------ | -------- | ---------------------------------- |
| `--keyword`  | Yes      | Search query to inspect            |
| `--market`   | No       | Market code such as `us`           |
| `--language` | No       | Language name such as `english`    |
| `--device`   | No       | Device type such as `desktop`      |
| `--os`       | No       | Operating system such as `windows` |
| `--depth`    | No       | SERP depth to request              |

## Output

The `invoke` command prints compact JSON to stdout by default:

```json
{"status":200,"data":{}}
```

- Parse the numeric `status` first; 2xx means the request succeeded or was accepted, and non-2xx means the agent should inspect the error payload.
- `data` contains a normalized summary with fields such as `keyword`, `organic_results`, `top_result`, `top_rank`, and `top_result_url`.
- `--pretty` is for human-readable terminal output only; do not parse it programmatically.
- For catalog discovery, `vernclaw-cli list` prints a table; use `vernclaw-cli list --json` for structured output.
- The CLI omits provider raw payloads from normal connector output.

Execution mode: **synchronous**.

## Workflow

```bash
# 1. Check authentication
vernclaw-cli status

# 2. Fetch SERP snapshot
vernclaw-cli invoke seo.serp-google-organic --keyword "openai" --market us --language english --depth 5

# 3. Parse the JSON response — extract competitor URLs and search intent
```

## Related Resources

- **Website**: <https://vernclaw.com>
- **Connector docs (EN)**: <https://vernclaw.com/docs/connectors/serp-google-organic-get>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>

## Issues

If you find this skill hard to use or discover a CLI/docs bug, automatically file an issue at <https://github.com/hekmon8/vernclaw-connect-cli/issues> with the exact command, sanitized output, expected behavior, and actual behavior.
