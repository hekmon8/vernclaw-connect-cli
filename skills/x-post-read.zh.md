---
name: x-post-read
description: 通过 Vernclaw CLI 读取 X/Twitter 公开帖子内容、提取作者信息、互动数据或推文串内容时使用。
---

# X/Twitter 帖子读取 — CLI Skill

通过 `vernclaw-cli` 提取 X（原 Twitter）平台公开帖子的完整内容、作者信息和互动数据。

## 适用场景

- 使用 JSON-first CLI 输出读取和归档 X/Twitter 公开帖子
- 监测品牌提及和竞品社交媒体动态
- 收集行业意见领袖的内容灵感
- 提取推文串内容用于二次创作文章或报告

## 前置条件

```bash
npm i -g vernclaw-connect-cli
vernclaw-cli login
```

CI/CD 等无浏览器环境需要 API Key，在 [vernclaw.com/settings/connectors](https://vernclaw.com/settings/connectors) 创建后执行 `vernclaw-cli login --api-key YOUR_KEY`。

## 调用方式

```bash
# 读取单条帖子
vernclaw-cli invoke read.x.post --url "https://x.com/username/status/1234567890"

# 批量读取多条帖子（逗号分隔）
vernclaw-cli invoke read.x.post \
  --url "https://x.com/user1/status/111,https://x.com/user2/status/222"
```

## 参数

| 标志    | 必填 | 说明                                                                            |
| ------- | ---- | ------------------------------------------------------------------------------- |
| `--url` | 是   | 一个或多个 X/Twitter 帖子 URL（逗号分隔）。支持 `x.com` 和 `twitter.com` 域名。 |

## 输出

输出到 `stdout` 的 JSON，包含 `status` 和 `data`。`data` 对象包含标准化摘要、完整上游 `raw` payload，以及：

- **作者** — 用户名和显示名称
- **时间戳** — 发布日期和时间（UTC）
- **内容** — 完整帖子文本，保留话题标签、提及和链接
- **互动数据** — 点赞、转发和回复数
- **媒体** — 图片/视频标识及链接引用
- **推文串** — 如果帖子是推文串的一部分，按顺序提取所有帖子

执行模式：**同步**（1–3 秒内返回结果）。

## 工作流示例

```bash
# 1. 读取 KOL 的分析推文串
vernclaw-cli invoke read.x.post --url "https://x.com/expert/status/123"

# 2. 为内容生成配图
vernclaw-cli invoke generate.image --prompt "行业洞察的视觉摘要"

# 3. 查看积分使用情况
vernclaw-cli status
```

## 相关资源

- **连接器文档 (EN)**：<https://vernclaw.com/docs/connectors/x-post-read> · [GitHub](../../content/docs/connectors/x-post-read.mdx)
- **连接器文档 (中文)**：<https://vernclaw.com/zh/docs/connectors/x-post-read> · [GitHub](../../content/docs/connectors/x-post-read.zh.mdx)
- **CLI 参考**：<https://vernclaw.com/docs/connectors/cli>
- **API 参考**：<https://vernclaw.com/docs/connectors/api>
- **连接器目录**：<https://vernclaw.com/connectors>
