---
name: domain-rank-overview-get
description: 在快速筛选域名时，使用域名排名与可见性汇总指标。
---

# 域名排名总览 — CLI Skill

通过 `vernclaw-cli` 查询目标域名的排名与可见性总览指标。

## 适用场景

- 快速对比多个域名的可见性表现
- 在尽调时快速筛选潜在合作域名
- 在竞争情报流程中提取域名级速览指标

## 前置条件

```bash
npm i -g vernclaw-connect-cli
vernclaw-cli login
```

## 调用方式

```bash
vernclaw-cli invoke seo.domain-rank-overview --target openai.com
vernclaw-cli invoke seo.domain-rank-overview --target openai.com --market us --language english
```

## 参数

| 标志         | 必填 | 说明                       |
| ------------ | ---- | -------------------------- |
| `--target`   | 是   | 要检查的目标域名           |
| `--market`   | 否   | 可选市场代码，如 `us`      |
| `--language` | 否   | 可选语言名称，如 `english` |

## 输出

输出到 `stdout` 的 JSON，包含 `status` 和 `data`。`data` 对象包含标准化摘要、完整上游 `raw` payload，以及 `Domain`、`Domain Rank`、`Organic Keywords`、`Organic Traffic` 和 `Top Keyword`。

执行模式：**同步**。

## 相关资源

- **连接器文档 (EN)**：<https://vernclaw.com/docs/connectors/domain-rank-overview-get>
- **连接器文档 (中文)**：<https://vernclaw.com/zh/docs/connectors/domain-rank-overview-get>
- **CLI 参考**：<https://vernclaw.com/docs/connectors/cli>
