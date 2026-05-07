---
name: domain-rank-overview-get
description: Use when checking aggregate domain rank/visibility signals and top keyword snapshots.
---

# Domain Rank Overview — CLI Skill

Fetch aggregate domain rank metrics for a target domain through `vernclaw-cli`.

## When to Use

- Compare domain visibility across a portfolio
- Screen potential partner or competitor domains quickly
- Feed rank overview snapshots into competitive intelligence workflows

## Prerequisites

```bash
npm i -g vernclaw-connect-cli
vernclaw-cli login
```

## Invocation

```bash
vernclaw-cli invoke seo.domain-rank-overview --target openai.com
vernclaw-cli invoke seo.domain-rank-overview --target openai.com --market us --language english
```

## Parameters

| Flag       | Required | Description                                  |
| ---------- | -------- | -------------------------------------------- |
| `--target` | Yes      | Target domain to inspect                      |
| `--market` | No       | Optional market code such as `us`             |
| `--language` | No     | Optional language name such as `english`      |

## Output

Markdown to `stdout` containing `Domain`, `Domain Rank`, `Organic Keywords`, `Organic Traffic`, and `Top Keyword`.

Execution mode: **synchronous**.

## Related Resources

- **Connector docs (EN)**: <https://vernclaw.com/docs/connectors/domain-rank-overview-get>
- **Connector docs (中文)**: <https://vernclaw.com/zh/docs/connectors/domain-rank-overview-get>
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
