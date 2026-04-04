---
name: keyword-search-volume-get
description: 通过 Vernclaw CLI 查看关键词实时搜索需求、广告竞争度或给 SEO 选题排优先级时使用。
---

# 关键词搜索量查询 — CLI Skill

通过 `vernclaw-cli` 查询关键词的实时需求。

## 适用场景

- 写内容前先验证主题需求
- 快速对比多个种子词
- 估算某个市场里的关键词需求
- 把需求信号直接交给 AI 工作流

## 前置条件

```bash
npm i -g vernclaw-connect-cli
vernclaw-cli login
```

## 调用方式

```bash
vernclaw-cli invoke seo.keyword-search-volume --keywords "openai" --market us --language english
```

## 参数

| 标志         | 必填 | 说明                           |
| ------------ | ---- | ------------------------------ |
| `--keywords` | 是   | 种子词，或逗号分隔的关键词列表 |
| `--market`   | 否   | 市场代码，如 `us`              |
| `--language` | 否   | 语言名称，如 `english`         |

## 输出

输出到 `stdout` 的 Markdown，包含 `Keywords Queried`、`Top Keyword`、`Search Volume`、`Competition` 和 `Competition Index`。

执行模式：**同步**。

## 相关资源

- **连接器文档 (EN)**：<https://vernclaw.com/docs/connectors/keyword-search-volume-get>
- **连接器文档 (中文)**：<https://vernclaw.com/zh/docs/connectors/keyword-search-volume-get>
- **CLI 参考**：<https://vernclaw.com/docs/connectors/cli>
