---
name: vernclaw-wechat-social-data
license: MIT
description: Use when calling TikHub-backed WeChat social data operations through Vernclaw's CLI.
---

# WeChat Social Data — CLI Skill

Call TikHub-backed WeChat operations through Vernclaw Connect CLI and return normalized social data for AI agents.

## When to Use

- Run WeChat research from an agent workflow without managing a TikHub key
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

```bash
vernclaw-cli invoke social.tikhub.wechat --operation channels_search_videos --params '{"keyword":"AI tools"}'
vernclaw-cli describe social.tikhub.wechat
```

## Parameters

| Flag          | Required | Description                                                                                                |
| ------------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| `--operation` | No       | TikHub operation name. Defaults to `channels_search_videos` when omitted.                                  |
| `--params`    | Yes      | JSON object passed to the selected TikHub operation. Use `'{}'` when the operation has no required params. |
| `--raw`       | No       | Return the raw AIAPI Center envelope when true.                                                            |

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
{"status":200,"data":{}}
```

Parse the numeric `status` first, then read `data`. The CLI omits provider raw payloads from normal connector output. Use `--pretty` only for human-readable terminal output, not automation. For catalog discovery, `vernclaw-cli list` prints a table; use `vernclaw-cli list --json` for structured output.

The `data` object includes normalized fields such as:

- **Platform** — `wechat`
- **Operation** — the TikHub operation that ran
- **Result** — normalized object or array returned by AIAPI Center
- **Items** — result rows when the operation returns a list

Execution mode: **synchronous**.

## Workflow

```bash
# 1. Check authentication
vernclaw-cli status

# 2. Inspect the connector schema
vernclaw-cli describe social.tikhub.wechat

# 3. Run a WeChat operation
vernclaw-cli invoke social.tikhub.wechat --operation channels_search_videos --params '{"keyword":"AI tools"}'
```

## Limits

- Only public or provider-accessible data supported by TikHub is returned.
- Some operations require upstream IDs, URLs, usernames, or pagination fields inside `--params`.
- Mutating operations require explicit acknowledgement in AIAPI Center before they run.

## Related Resources

- **Website**: <https://vernclaw.com>
- **Platform page**: <https://vernclaw.com/connectors/wechat>
- **Connector detail**: <https://vernclaw.com/connectors/wechat-social-data>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
- **API reference**: <https://vernclaw.com/docs/connectors/api>
- **Connector catalog**: <https://vernclaw.com/connectors>

## Issue Feedback

If this skill is hard to use or the CLI/docs appear buggy, automatically file an issue at <https://github.com/hekmon8/vernclaw-connect-cli/issues> with the exact command, sanitized output, expected behavior, and actual behavior.
