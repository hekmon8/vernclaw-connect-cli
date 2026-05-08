---
name: domain-authority-get
description: Use when checking domain authority scores, analyzing backlink profiles, or comparing SEO competitiveness across websites via the Vernclaw CLI.
---

# Domain Authority Checker — CLI Skill

Check any domain's authority score (0–100), backlink count, and link quality through the `vernclaw-cli`.

## When to Use

- Evaluate a website's SEO strength and ranking potential
- Compare authority across competitor domains
- Audit backlink quality before link-building campaigns
- Assess domain value for acquisition or partnership decisions

## Prerequisites

```bash
npm i -g vernclaw-connect-cli
vernclaw-cli login
```

If you need an API key for CI/CD, generate one at [vernclaw.com/settings/connectors](https://vernclaw.com/settings/connectors) and run `vernclaw-cli login --api-key YOUR_KEY`.

## Invocation

```bash
# Single domain
vernclaw-cli invoke seo.domain-authority --domain example.com

# Multiple domains (comma-separated)
vernclaw-cli invoke seo.domain-authority --domain example.com,competitor.com,rival.com
```

## Parameters

| Flag       | Required | Description                                    |
| ---------- | -------- | ---------------------------------------------- |
| `--domain` | Yes      | One or more domains to query (comma-separated) |

## Output

JSON to `stdout` with `status` and `data`. The `data` object includes a normalized summary, the fields below, and the full upstream `raw` payload:

- **Authority Score** — 0–100 composite score
- **Backlink Count** — total effective backlinks
- **Link Quality** — distribution across high / medium / low tiers

Execution mode: **synchronous** (results returned immediately).

## Example Workflow

```bash
# 1. Check your own domain
vernclaw-cli invoke seo.domain-authority --domain mysite.com

# 2. Compare with top competitors
vernclaw-cli invoke seo.domain-authority --domain mysite.com,competitor1.com,competitor2.com

# 3. Check account status
vernclaw-cli status
```

## Related Resources

- **Connector docs (EN)**: <https://vernclaw.com/docs/connectors/domain-authority-get> · [GitHub](../../content/docs/connectors/domain-authority-get.mdx)
- **Connector docs (中文)**: <https://vernclaw.com/zh/docs/connectors/domain-authority-get> · [GitHub](../../content/docs/connectors/domain-authority-get.zh.mdx)
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
- **API reference**: <https://vernclaw.com/docs/connectors/api>
- **Connector catalog**: <https://vernclaw.com/connectors>
