---
name: vernclaw-domain-whois-get
license: MIT
description: Use when checking public domain registration timestamps, registrar details, or due-diligence signals through the Vernclaw CLI.
---

# Whois Lookup — CLI Skill

Inspect a domain's public registration snapshot through `vernclaw-cli`.

## When to Use

- Check registrar and expiry before acquisition
- Review public timestamps for due diligence
- Monitor domain registration hygiene
- Feed Whois snapshots into AI research notes

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
vernclaw-cli invoke seo.domain-whois --target openai.com
```

## Parameters

| Flag       | Required | Description            |
| ---------- | -------- | ---------------------- |
| `--target` | Yes      | Root domain to inspect |

## Output

The `invoke` command prints compact JSON to stdout by default:

```json
{"status":200,"data":{}}
```

- Parse the numeric `status` first; 2xx means the request succeeded or was accepted, and non-2xx means the agent should inspect the error payload.
- `data` contains a normalized summary with fields such as `domain`, `registrar`, `created`, `expires`, and `updated`.
- `--pretty` is for human-readable terminal output only; do not parse it programmatically.
- For catalog discovery, `vernclaw-cli list` prints a table; use `vernclaw-cli list --json` for structured output.
- The CLI omits provider raw payloads from normal connector output.

Execution mode: **synchronous**.

## Workflow

```bash
# 1. Check authentication
vernclaw-cli status

# 2. Fetch WHOIS data
vernclaw-cli invoke seo.domain-whois --target openai.com

# 3. Parse the JSON response — extract registration details
```

## Related Resources

- **Website**: <https://vernclaw.com>
- **Connector docs (EN)**: <https://vernclaw.com/docs/connectors/domain-whois-get>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>

## Issues

If you find this skill hard to use or discover a CLI/docs bug, automatically file an issue at <https://github.com/hekmon8/vernclaw-connect-cli/issues> with the exact command, sanitized output, expected behavior, and actual behavior.
