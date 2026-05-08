---
name: website-traffic-get
description: 通过 Vernclaw CLI 估算网站流量、分析流量来源和地理分布或对比竞品流量时使用。
---

# 网站流量查询 — CLI Skill

通过 `vernclaw-cli` 估算任意网站的月度访问量、主要流量渠道和地理分布。

## 适用场景

- 估算竞品或目标网站的流量
- 识别主要流量渠道（自然搜索、直接访问、引荐、社交、付费）
- 分析访客的地理分布
- 在营销活动前后对比流量基线

## 前置条件

```bash
npm i -g vernclaw-connect-cli
vernclaw-cli login
```

CI/CD 等无浏览器环境需要 API Key，在 [vernclaw.com/settings/connectors](https://vernclaw.com/settings/connectors) 创建后执行 `vernclaw-cli login --api-key YOUR_KEY`。

## 调用方式

```bash
# 全球流量估算
vernclaw-cli invoke seo.website-traffic --domain example.com

# 指定市场的流量
vernclaw-cli invoke seo.website-traffic --domain example.com --market US

# 批量查询多个域名
vernclaw-cli invoke seo.website-traffic --domain example.com,competitor.com
```

## 参数

| 标志       | 必填 | 说明                                                   |
| ---------- | ---- | ------------------------------------------------------ |
| `--domain` | 是   | 要查询的一个或多个域名（逗号分隔）                     |
| `--market` | 否   | 国家/地区代码，用于筛选流量数据（如 `US`、`UK`、`CN`） |

## 输出

输出到 `stdout` 的 JSON，包含 `status` 和 `data`。`data` 对象包含标准化摘要、完整上游 `raw` payload，以及：

- **估算月度访问量** — 总访问量估算
- **主要流量国家** — 贡献最多流量的国家
- **主要流量渠道** — 最主要的流量来源
- **流量趋势** — 增长或下降指标（如有）

执行模式：**同步**（立即返回结果）。

## 工作流示例

```bash
# 1. 查询竞品流量
vernclaw-cli invoke seo.website-traffic --domain competitor.com

# 2. 对比多个竞品
vernclaw-cli invoke seo.website-traffic --domain site1.com,site2.com,site3.com

# 3. 深入分析特定市场
vernclaw-cli invoke seo.website-traffic --domain competitor.com --market US

# 4. 结合权威度查询
vernclaw-cli invoke seo.domain-authority --domain competitor.com
```

## 相关资源

- **连接器文档 (EN)**：<https://vernclaw.com/docs/connectors/website-traffic-get> · [GitHub](../../content/docs/connectors/website-traffic-get.mdx)
- **连接器文档 (中文)**：<https://vernclaw.com/zh/docs/connectors/website-traffic-get> · [GitHub](../../content/docs/connectors/website-traffic-get.zh.mdx)
- **CLI 参考**：<https://vernclaw.com/docs/connectors/cli>
- **API 参考**：<https://vernclaw.com/docs/connectors/api>
- **连接器目录**：<https://vernclaw.com/connectors>
