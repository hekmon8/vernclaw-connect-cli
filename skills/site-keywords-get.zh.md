---
name: site-keywords-get
description: 通过 Vernclaw CLI 查看域名关键词覆盖、对比竞品或发现内容缺口时使用。
---

# 站点关键词 — CLI Skill

通过 `vernclaw-cli` 查看域名的关键词覆盖情况。

## 适用场景

- 梳理竞品的关键词覆盖面
- 找内容缺口
- 统一对比多个域名
- 为 AI 分析准备域名覆盖摘要

## 前置条件

```bash
npm i -g vernclaw-connect-cli
vernclaw-cli login
```

## 调用方式

```bash
vernclaw-cli invoke seo.site-keywords --target openai.com --market us --language english
```

## 参数

| 标志         | 必填 | 说明                   |
| ------------ | ---- | ---------------------- |
| `--target`   | 是   | 要检查的根域名         |
| `--market`   | 否   | 市场代码，如 `us`      |
| `--language` | 否   | 语言名称，如 `english` |

## 输出

输出到 `stdout` 的 Markdown，包含 `Target`、`Fetched Keywords`、`Top Keyword` 和 `Top Keyword Volume`。

执行模式：**同步**。
