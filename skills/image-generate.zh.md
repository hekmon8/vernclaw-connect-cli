---
name: image-generate
description: 通过 Vernclaw CLI 根据文本提示生成图像、创建营销视觉素材或生成 AI 艺术作品时使用。
---

# AI 图像生成 — CLI Skill

通过 `vernclaw-cli` 根据文本提示生成高质量图像。采用异步处理——提交任务后轮询获取结果。

## 适用场景

- 根据文字描述创建社交媒体配图
- 生成营销物料和广告创意
- 为博客文章或文档制作插画
- 快速原型化产品概念和 UI 设计

## 前置条件

```bash
npm i -g vernclaw-connect-cli
vernclaw-cli login
```

CI/CD 等无浏览器环境需要 API Key，在 [vernclaw.com/settings/connectors](https://vernclaw.com/settings/connectors) 创建后执行 `vernclaw-cli login --api-key YOUR_KEY`。

## 调用方式

```bash
# 基础生成
vernclaw-cli invoke generate.image \
  --prompt "现代化办公室，落地窗，自然光线"

# 指定尺寸
vernclaw-cli invoke generate.image \
  --prompt "扁平化数据可视化图表，蓝色调" \
  --size landscape
```

命令会立即返回一个 **任务 ID**。使用它查看状态：

```bash
vernclaw-cli job get img_abc123xyz
```

## 参数

| 标志 | 必填 | 说明 |
|------|------|------|
| `--prompt` | 是 | 要生成图像的文字描述 |
| `--size` | 否 | 输出尺寸：`square`、`portrait`、`landscape`、`banner`（默认：`square`） |

## 输出

**提交时** — 包含任务 ID 和预估等待时间的 Markdown 确认。

**完成后**（通过 `job get`）— Markdown 包含：

- **提示词** — 用于生成的文本
- **尺寸** — 选择的参数
- **图像 URL** — 生成图像的链接
- **预览链接** — 可在浏览器中查看的预览

执行模式：**异步**（标准尺寸 30–60 秒，高分辨率 1–3 分钟）。

## 工作流示例

```bash
# 1. 提交图像生成
vernclaw-cli invoke generate.image \
  --prompt "橘猫趴在窗台上，阳光洒入，水彩风格" \
  --size square

# 2. 轮询任务完成状态
vernclaw-cli job get img_abc123xyz

# 3. 生成变体
vernclaw-cli invoke generate.image \
  --prompt "橘猫趴在窗台上，日落时分，油画风格" \
  --size landscape

# 4. 查看积分余额
vernclaw-cli balance
```

## 相关资源

- **连接器文档 (EN)**：<https://vernclaw.com/docs/connectors/image-generate> · [GitHub](../../content/docs/connectors/image-generate.mdx)
- **连接器文档 (中文)**：<https://vernclaw.com/zh/docs/connectors/image-generate> · [GitHub](../../content/docs/connectors/image-generate.zh.mdx)
- **CLI 参考**：<https://vernclaw.com/docs/connectors/cli>
- **API 参考**：<https://vernclaw.com/docs/connectors/api>
- **连接器目录**：<https://vernclaw.com/connectors>
