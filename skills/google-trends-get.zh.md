---
name: google-trends-get
description: 通过 Vernclaw CLI 检查关键词热度和趋势变化时使用。
---

# Google Trends 查询 — CLI Skill

通过 `vernclaw-cli` 查询关键词趋势信号。

## 适用场景

- 判断某个主题需求是否在上升或下降
- 在制定内容排期前对比关键词趋势
- 在 AI 工作流中补充趋势信号

## 前置条件

```bash
npm i -g vernclaw-connect-cli
vernclaw-cli login
```

## 调用方式

```bash
vernclaw-cli invoke seo.google-trends --keywords "openai,chatgpt" --market us --language english
```

## 参数

| 标志         | 必填 | 说明                                 |
| ------------ | ---- | ------------------------------------ |
| `--keywords` | 是   | 种子词或逗号分隔关键词列表             |
| `--market`   | 否   | 市场代码，如 `us`                    |
| `--language` | 否   | 语言名称，如 `english`               |

## 输出

输出到 `stdout` 的 Markdown，包含 `Keywords Queried`、`Trend Points`、`Top Trend Value` 和 `Latest Date`。

执行模式：**同步**。

## 相关资源

- **连接器文档 (EN)**：<https://vernclaw.com/docs/connectors/google-trends-get>
- **连接器文档 (中文)**：<https://vernclaw.com/zh/docs/connectors/google-trends-get>
- **CLI 参考**：<https://vernclaw.com/docs/connectors/cli>
