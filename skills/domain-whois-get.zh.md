---
name: domain-whois-get
description: 通过 Vernclaw CLI 查看域名公开注册时间、注册商信息或尽调信号时使用。
---

# Whois 查询 — CLI Skill

通过 `vernclaw-cli` 查看域名的公开注册快照。

## 适用场景

- 在收购前检查注册商和到期时间
- 在尽调中查看公开时间字段
- 跟踪域名注册维护情况
- 把 Whois 快照交给 AI 继续整理

## 前置条件

```bash
npm i -g vernclaw-connect-cli
vernclaw-cli login
```

## 调用方式

```bash
vernclaw-cli invoke seo.domain-whois --target openai.com
```

## 参数

| 标志       | 必填 | 说明           |
| ---------- | ---- | -------------- |
| `--target` | 是   | 要检查的根域名 |

## 输出

输出到 `stdout` 的 Markdown，包含 `Domain`、`Registrar`、`Created`、`Expires` 和 `Updated`。

执行模式：**同步**。
