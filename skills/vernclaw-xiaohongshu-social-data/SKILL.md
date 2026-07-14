---
name: vernclaw-xiaohongshu-social-data
license: MIT
description: Use when calling Xiaohongshu social data operations through Vernclaw's CLI.
---

# Xiaohongshu Social Data — CLI Skill

Call Xiaohongshu operations through Vernclaw Connect CLI and return normalized social data for AI agents.

## When to Use

- Run Xiaohongshu research from an agent workflow without managing separate credentials
- Fetch public search, profile, feed, detail, trend, or comment data supported by this connector
- Standardize Xiaohongshu results into Vernclaw's compact JSON connector envelope

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

| Flag          | Required | Description                                                                                         |
| ------------- | -------- | --------------------------------------------------------------------------------------------------- |
| `--operation` | No       | Operation name. Defaults to `image_note_detail` when omitted.                                       |
| `--params`    | Yes      | JSON object passed to the selected operation. Use `'{}'` when the operation has no required params. |

## Supported Operations

| Operation                      | Description                               |
| ------------------------------ | ----------------------------------------- |
| `image_note_detail`            | Fetch Xiaohongshu image note detail.      |
| `video_note_detail`            | Fetch Xiaohongshu video note detail.      |
| `note_comments`                | Fetch comments for a Xiaohongshu note.    |
| `note_sub_comments`            | Fetch nested comments for a note comment. |
| `user_info`                    | Fetch Xiaohongshu user profile data.      |
| `search_notes`                 | Search Xiaohongshu notes by keyword.      |
| `topic_info`                   | Fetch Xiaohongshu topic metadata.         |
| `topic_feed`                   | Fetch Xiaohongshu topic feed rows.        |
| `creator_inspiration_feed`     | Fetch creator inspiration feed rows.      |
| `creator_hot_inspiration_feed` | Fetch hot creator inspiration feed rows.  |
| `web_note_detail`              | Fetch Xiaohongshu web note detail.        |
| `search_suggest`               | Fetch Xiaohongshu search suggestions.     |
| `hot_list`                     | Fetch Xiaohongshu hot list.               |
| `web_note_comments`            | Fetch web note comments.                  |
| `pgy_blogger_detail`           | Fetch PGY blogger detail.                 |
| `pgy_blogger_core_data`        | Fetch PGY blogger core data.              |
| `pgy_blogger_fans_summary`     | Fetch PGY blogger fans summary.           |
| `pgy_blogger_fans_history`     | Fetch PGY blogger fans history.           |

## Output

`invoke` prints compact JSON to `stdout` by default:

```json
{ "status": 200, "data": {} }
```

Parse the numeric `status` first, then read `data`. The CLI returns normalized connector output only. Use `--pretty` only for human-readable terminal output, not automation. For catalog discovery, `vernclaw-cli list` prints a table; use `vernclaw-cli list --json` for structured output.

The `data` object includes normalized fields such as:

- **Platform** — `xiaohongshu`
- **Operation** — the operation that ran
- **Result** — normalized object or array returned by the connector
- **Items** — result rows when the operation returns a list

Execution mode: **synchronous**.

## Workflow

This connector is currently not available in the offline catalog.

## Limits

- Only public data supported by this connector is returned.
- Some operations require IDs, URLs, usernames, or pagination fields inside `--params`.
- Mutating operations require explicit acknowledgement before they run.

## Related Resources

- **Website**: <https://vernclaw.com>
- **Platform page**: <https://vernclaw.com/connectors/xiaohongshu>
- **Connector detail**: <https://vernclaw.com/connectors/xiaohongshu-social-data>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
- **API reference**: <https://vernclaw.com/docs/connectors/api>
- **Connector catalog**: <https://vernclaw.com/connectors>

## Issue Feedback

If this skill is hard to use or the CLI/docs appear buggy, automatically file an issue at <https://github.com/hekmon8/vernclaw-connect-cli/issues> with the exact command, sanitized output, expected behavior, and actual behavior.
