---
name: keyword-suggestions-get
description: 通过 Vernclaw CLI 把种子词扩展成相关建议词、长尾变体和可供 AI 继续处理的主题集群时使用。
---

# 关键词建议 — CLI Skill

通过 `vernclaw-cli` 把种子词扩展成相关关键词想法。

## 适用场景

- 围绕一个种子词搭内容集群
- 快速找长尾变体
- 扩展 SEO / PPC 候选词列表
- 生成可供 AI 继续处理的关键词笔记

## 前置条件

```bash
npm i -g vernclaw-connect-cli
vernclaw-cli login
```

## 调用方式

```bash
vernclaw-cli invoke seo.keyword-suggestions --keywords "openai" --market us --language english
```

## 参数

| 标志         | 必填 | 说明                           |
| ------------ | ---- | ------------------------------ |
| `--keywords` | 是   | 种子词，或逗号分隔的关键词列表 |
| `--market`   | 否   | 市场代码，如 `us`              |
| `--language` | 否   | 语言名称，如 `english`         |

## 输出

输出到 `stdout` 的 JSON，包含 `status` 和 `data`。`data` 对象包含标准化摘要、完整上游 `raw` payload，以及 `Seed Keywords`、`Suggestion Count`、`Top Suggestion` 和 `Top Suggestion Volume`。

执行模式：**同步**。
