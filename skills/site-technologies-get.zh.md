---
name: site-technologies-get
description: 通过 Vernclaw CLI 检测网站公开技术栈、规划迁移或筛选技术线索时使用。
---

# 站点技术栈 — CLI Skill

通过 `vernclaw-cli` 检测网站公开可见的技术栈。

## 适用场景

- 查看竞品公开技术栈
- 基于现有可见工具规划迁移
- 按技术栈筛选销售线索
- 为 AI 分析准备技术快照

## 前置条件

```bash
npm i -g vernclaw-connect-cli
vernclaw-cli login
```

## 调用方式

```bash
vernclaw-cli invoke seo.site-technologies --target openai.com
```

## 参数

| 标志       | 必填 | 说明           |
| ---------- | ---- | -------------- |
| `--target` | 是   | 要检查的根域名 |

## 输出

输出到 `stdout` 的 JSON，包含 `status` 和 `data`。`data` 对象包含标准化摘要、完整上游 `raw` payload，以及 `Target`、`Detected Technologies` 和 `Top Technology`。

执行模式：**同步**。
