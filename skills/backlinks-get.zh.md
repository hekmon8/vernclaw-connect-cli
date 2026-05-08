---
name: backlinks-get
description: 通过 Vernclaw CLI 查看域名的实时反向链接样本、引荐页面或快速审计站外 SEO 时使用。
---

# 反向链接查询 — CLI Skill

通过 `vernclaw-cli` 获取目标域名的实时反向链接样本。

## 适用场景

- 在清理链接前先看引荐页面样本
- 快速分析竞品的站外 SEO 机会
- 不离开终端先抽样查看链接质量
- 把反向链接结果交给 AI 继续研究

## 前置条件

```bash
npm i -g vernclaw-connect-cli
vernclaw-cli login
```

## 调用方式

```bash
vernclaw-cli invoke seo.backlinks --target example.com
vernclaw-cli invoke seo.backlinks --target example.com --limit 10
```

## 参数

| 标志       | 必填 | 说明                         |
| ---------- | ---- | ---------------------------- |
| `--target` | 是   | 要检查的根域名               |
| `--limit`  | 否   | 可选，返回多少条反向链接样本 |

## 输出

输出到 `stdout` 的 JSON，包含 `status` 和 `data`。`data` 对象包含标准化摘要、完整上游 `raw` payload，以及反向链接样本、引荐域名以及可用的质量/排名信号。

执行模式：**同步**。

## 相关资源

- **连接器文档 (EN)**：<https://vernclaw.com/docs/connectors/backlinks-get>
- **连接器文档 (中文)**：<https://vernclaw.com/zh/docs/connectors/backlinks-get>
- **CLI 参考**：<https://vernclaw.com/docs/connectors/cli>
