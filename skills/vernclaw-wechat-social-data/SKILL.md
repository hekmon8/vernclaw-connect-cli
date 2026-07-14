---
name: vernclaw-wechat-social-data
license: MIT
description: Use when calling WeChat social data operations through Vernclaw's CLI.
---

# WeChat Social Data — CLI Skill

Call WeChat operations through Vernclaw Connect CLI and return normalized social data for AI agents.

## When to Use

- Run WeChat research from an agent workflow without managing separate credentials
- Fetch public search, profile, feed, detail, trend, or comment data supported by this connector
- Standardize WeChat results into Vernclaw's compact JSON connector envelope

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
| `--operation` | No       | Operation name. Defaults to `channels_search_videos` when omitted.                                  |
| `--params`    | Yes      | JSON object passed to the selected operation. Use `'{}'` when the operation has no required params. |

## Supported Operations

| Operation                | Description                              |
| ------------------------ | ---------------------------------------- |
| `channels_search_videos` | Search videos inside a WeChat Channel.   |
| `channels_user_profile`  | Fetch WeChat Channels user profile data. |
| `channels_video_detail`  | Fetch WeChat Channels video detail.      |
| `mp_article_detail`      | Fetch WeChat MP article detail by URL.   |
| `mp_account_profile`     | Fetch WeChat MP account profile.         |
| `mp_article_stats`       | Fetch WeChat MP article statistics.      |
| `search`                 | Search WeChat content by keyword.        |
| `search_videos`          | Search WeChat video content by keyword.  |

## Output

`invoke` prints compact JSON to `stdout` by default:

```json
{ "status": 200, "data": {} }
```

Parse the numeric `status` first, then read `data`. The CLI returns normalized connector output only. Use `--pretty` only for human-readable terminal output, not automation. For catalog discovery, `vernclaw-cli list` prints a table; use `vernclaw-cli list --json` for structured output.

The `data` object includes normalized fields such as:

- **Platform** — `wechat`
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
- **Platform page**: <https://vernclaw.com/connectors/wechat>
- **Connector detail**: <https://vernclaw.com/connectors/wechat-social-data>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
- **API reference**: <https://vernclaw.com/docs/connectors/api>
- **Connector catalog**: <https://vernclaw.com/connectors>

## Issue Feedback

If this skill is hard to use or the CLI/docs appear buggy, automatically file an issue at <https://github.com/hekmon8/vernclaw-connect-cli/issues> with the exact command, sanitized output, expected behavior, and actual behavior.
