---
name: vernclaw-image-generate
description: Use when generating images from text prompts, creating marketing visuals, or producing AI art via the Vernclaw CLI.
---

# AI Image Generator — CLI Skill

Generate high-quality images from text prompts through the `vernclaw-cli`. Uses asynchronous processing — submit a job and poll for results.

## When to Use

- Create social media visuals from text descriptions
- Generate marketing materials and ad creatives
- Produce illustrations for blog posts or documentation
- Rapid-prototype product concepts and UI mockups

## Prerequisites

```bash
npm i -g vernclaw-connect-cli
```

## Authentication

Before using this skill, check the CLI authentication state:

```bash
vernclaw-cli status
```

If the CLI is not authenticated, run `vernclaw-cli login`. For CI/CD or headless agents, generate an API key at [vernclaw.com/settings/connectors](https://vernclaw.com/settings/connectors) and run `vernclaw-cli login --api-key YOUR_KEY`.

## Invocation

```bash
# Basic generation
vernclaw-cli invoke generate.image \
  --prompt "A modern office with floor-to-ceiling windows, natural light"

# With size option
vernclaw-cli invoke generate.image \
  --prompt "Flat design data visualization, blue palette" \
  --size landscape
```

The command returns a **job ID** immediately. Use it to check status:

```bash
vernclaw-cli job get img_abc123xyz
```

## Parameters

| Flag       | Required | Description                                                                  |
| ---------- | -------- | ---------------------------------------------------------------------------- |
| `--prompt` | Yes      | Text description of the image to generate                                    |
| `--size`   | No       | Output size: `square`, `portrait`, `landscape`, `banner` (default: `square`) |

## Output

`invoke` and `job get` print compact JSON to `stdout` by default:

```json
{"status":202,"data":{}}
```

Parse the numeric `status` first, then read `data`. The CLI omits provider raw payloads from normal connector output. Use `--pretty` only for human-readable terminal output, not automation. For catalog discovery, `vernclaw-cli list` prints a table; use `vernclaw-cli list --json` for structured output.

**On submission** — JSON with `status` and `data`, including the job ID and estimated wait time.

**On completion** (via `job get`) — JSON with `status` and `data`, including a normalized summary and image URL metadata:

- **Prompt** — the text used for generation
- **Size** — selected option
- **Image URL** — link to the generated image
- **Preview link** — browser-viewable preview

Execution mode: **asynchronous** (standard size 30–60 s, high resolution 1–3 min).

## Example Workflow

```bash
# 1. Submit image generation
vernclaw-cli status
vernclaw-cli invoke generate.image \
  --prompt "Orange cat on a windowsill, sunlight, watercolor style" \
  --size square

# 2. Poll for completion
vernclaw-cli job get img_abc123xyz

# 3. Generate a variant
vernclaw-cli invoke generate.image \
  --prompt "Orange cat on a windowsill, sunset, oil painting style" \
  --size landscape

# 4. Check account status
vernclaw-cli status
```

## Related Resources

- **Website**: <https://vernclaw.com>
- **Connector docs (EN)**: <https://vernclaw.com/docs/connectors/image-generate> · [GitHub](../../content/docs/connectors/image-generate.mdx)
- **CLI reference**: <https://vernclaw.com/docs/connectors/cli>
- **API reference**: <https://vernclaw.com/docs/connectors/api>
- **Connector catalog**: <https://vernclaw.com/connectors>

## Issue Feedback

If this skill is hard to use or the CLI/docs appear buggy, automatically file an issue at <https://github.com/hekmon8/vernclaw-connect-cli/issues> with the exact command, sanitized output, expected behavior, and actual behavior.
