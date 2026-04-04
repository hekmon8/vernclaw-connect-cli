---
name: serp-google-organic-get
description: 通过 Vernclaw CLI 查看 Google 自然搜索实时结果、判断搜索意图或检查首页竞品时使用。
---

# SERP Google 自然结果 — CLI Skill

通过 `vernclaw-cli` 查看 Google 自然结果实时快照。

## 适用场景

- 发布内容前先看首页竞品
- 在真实 SERP 里验证搜索意图
- 跟踪头部结果 URL 形态
- 把 SERP 快照交给 AI 继续研究

## 前置条件

```bash
npm i -g vernclaw-connect-cli
vernclaw-cli login
```

## 调用方式

```bash
vernclaw-cli invoke seo.serp-google-organic --keyword "openai" --market us --language english --device desktop --os windows --depth 5
```

## 参数

| 标志         | 必填 | 说明                   |
| ------------ | ---- | ---------------------- |
| `--keyword`  | 是   | 要检查的搜索词         |
| `--market`   | 否   | 市场代码，如 `us`      |
| `--language` | 否   | 语言名称，如 `english` |
| `--device`   | 否   | 设备类型，如 `desktop` |
| `--os`       | 否   | 操作系统，如 `windows` |
| `--depth`    | 否   | 要请求的结果深度       |

## 输出

输出到 `stdout` 的 Markdown，包含 `Keyword`、`Organic Results`、`Top Result`、`Top Rank` 和 `Top Result URL`。

执行模式：**同步**。
