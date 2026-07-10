---
name: vernclaw-linkedin-social-data
license: MIT
description: Use when calling TikHub-backed LinkedIn social data operations through Vernclaw's CLI.
---

# LinkedIn Social Data — CLI Skill

Call TikHub-backed LinkedIn operations through Vernclaw Connect CLI and return normalized social data for AI agents.

## When to Use

- Run LinkedIn research from an agent workflow without managing a TikHub key
- Fetch public search, profile, feed, detail, trend, or comment data supported by this connector
- Standardize LinkedIn results into Vernclaw's compact JSON connector envelope

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

This connector is currently not available in the offline catalog.

## Parameters

| Flag          | Required | Description                                                                                                |
| ------------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| `--operation` | No       | TikHub operation name. Defaults to `user_profile` when omitted.                                            |
| `--params`    | Yes      | JSON object passed to the selected TikHub operation. Use `'{}'` when the operation has no required params. |
| `--raw`       | No       | Return the raw AIAPI Center envelope when true.                                                            |

## Supported Operations

| Operation       | Description                                                                 |
| --------------- | --------------------------------------------------------------------------- |
| `user_profile`  | Fetch public LinkedIn profile data.                                         |
| `user_posts`    | Fetch public posts for a LinkedIn profile urn.                              |
| `search_people` | Search LinkedIn people by name, role, company, school, or location filters. |
| `post_detail`   | Fetch detail for a LinkedIn post id.                                        |

## Output

`invoke` prints compact JSON to `stdout` by default:

```json
{"status":200,"data":{}}
```

Parse the numeric `status` first, then read `data`. The CLI omits provider raw payloads from normal connector output. Use `--pretty` only for human-readable terminal output, not automation. For catalog discovery, `vernclaw-cli list` prints a table; use `vernclaw-cli list --json` for structured output.

The `data` object includes normalized fields such as:

- **Platform** — `linkedin`
- **Operation** — the TikHub operation that ran
- **Result** — normalized object or array returned by AIAPI Center
- **Items** — result rows when the operation returns a list

Execution mode: **synchronous**.

## Workflow

This connector is currently not available in the offline catalog.
## Limits

- Only public or provider-accessible data supported by TikHub is returned.
- Some operations require upstream IDs, URLs, usernames, or pagination fields inside `--params`.
- Mutating operations require explicit acknowledgement in AIAPI Center before they run.

## Related Resources

- **Website**: <https://vernclaw.com>
- **Platform page**: <https://vernclaw.com/connectors/linkedin>
- **Connector detail**: <https://vernclaw.com/connectors/linkedin-social-data>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
- **API reference**: <https://vernclaw.com/docs/connectors/api>
- **Connector catalog**: <https://vernclaw.com/connectors>

## Issue Feedback

If this skill is hard to use or the CLI/docs appear buggy, automatically file an issue at <https://github.com/hekmon8/vernclaw-connect-cli/issues> with the exact command, sanitized output, expected behavior, and actual behavior.
