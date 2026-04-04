---
name: domain-authority-get
description: 通过 Vernclaw CLI 查询域名权威度评分、分析反向链接质量或对比竞品 SEO 竞争力时使用。
---

# 域名权威度查询 — CLI Skill

通过 `vernclaw-cli` 查询任意域名的权威度评分（0–100）、反向链接数量和链接质量。

## 适用场景

- 评估网站 SEO 实力和排名潜力
- 对比多个竞品域名的权威度
- 在链接建设前审计反向链接质量
- 评估域名收购或合作的价值

## 前置条件

```bash
npm i -g vernclaw-connect-cli
vernclaw-cli login
```

CI/CD 等无浏览器环境需要 API Key，在 [vernclaw.com/settings/connectors](https://vernclaw.com/settings/connectors) 创建后执行 `vernclaw-cli login --api-key YOUR_KEY`。

## 调用方式

```bash
# 查询单个域名
vernclaw-cli invoke seo.domain-authority --domain example.com

# 批量查询多个域名（逗号分隔）
vernclaw-cli invoke seo.domain-authority --domain example.com,competitor.com,rival.com
```

## 参数

| 标志       | 必填 | 说明                               |
| ---------- | ---- | ---------------------------------- |
| `--domain` | 是   | 要查询的一个或多个域名（逗号分隔） |

## 输出

Markdown 表格输出到 `stdout`，包含：

- **权威度评分** — 0–100 综合评分
- **反向链接数** — 有效反向链接总数
- **链接质量** — 高/中/低质量分布

执行模式：**同步**（立即返回结果）。

## 工作流示例

```bash
# 1. 查询自己的域名
vernclaw-cli invoke seo.domain-authority --domain mysite.com

# 2. 与主要竞品对比
vernclaw-cli invoke seo.domain-authority --domain mysite.com,competitor1.com,competitor2.com

# 3. 查看账户状态
vernclaw-cli status
```

## 相关资源

- **连接器文档 (EN)**：<https://vernclaw.com/docs/connectors/domain-authority-get> · [GitHub](../../content/docs/connectors/domain-authority-get.mdx)
- **连接器文档 (中文)**：<https://vernclaw.com/zh/docs/connectors/domain-authority-get> · [GitHub](../../content/docs/connectors/domain-authority-get.zh.mdx)
- **CLI 参考**：<https://vernclaw.com/docs/connectors/cli>
- **API 参考**：<https://vernclaw.com/docs/connectors/api>
- **连接器目录**：<https://vernclaw.com/connectors>
