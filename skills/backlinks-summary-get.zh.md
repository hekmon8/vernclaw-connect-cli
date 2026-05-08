---
name: backlinks-summary-get
description: 在只做快速审计时，用于获取域名反向链接汇总指标。
---

# 反向链接汇总查询 — CLI Skill

通过 `vernclaw-cli` 拉取目标域名的反链汇总指标。

## 适用场景

- 深入抓取前先做反链规模快速判断
- 用总反链数和引荐域名数做竞争对比
- 在周度 SEO 回顾中快速校验趋势方向

## 前置条件

```bash
npm i -g vernclaw-connect-cli
vernclaw-cli login
```

## 调用方式

```bash
vernclaw-cli invoke seo.backlinks-summary --target openai.com
vernclaw-cli invoke seo.backlinks-summary --target openai.com --limit 20 --offset 0
```

## 参数

| 标志       | 必填 | 说明             |
| ---------- | ---- | ---------------- |
| `--target` | 是   | 要检查的根域名   |
| `--limit`  | 否   | 可选采样行数参数 |
| `--offset` | 否   | 可选分页偏移参数 |

## 输出

输出到 `stdout` 的 JSON，包含 `status` 和 `data`。`data` 对象包含标准化摘要、完整上游 `raw` payload，以及 `Target`、`Total Backlinks`、`Referring Domains` 和 `Top Referring Domain`。

执行模式：**同步**。

## 相关资源

- **连接器文档 (EN)**：<https://vernclaw.com/docs/connectors/backlinks-summary-get>
- **连接器文档 (中文)**：<https://vernclaw.com/zh/docs/connectors/backlinks-summary-get>
- **CLI 参考**：<https://vernclaw.com/docs/connectors/cli>
