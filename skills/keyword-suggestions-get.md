---
name: keyword-suggestions-get
description: Use when expanding a seed keyword into related ideas, long-tail variants, and AI-ready topic clusters through the Vernclaw CLI.
---

# Keyword Suggestions — CLI Skill

Expand a seed term into related keyword ideas through `vernclaw-cli`.

## When to Use

- Build a content cluster from one seed term
- Find long-tail variants quickly
- Expand PPC / SEO idea lists
- Generate AI-ready keyword research notes

## Prerequisites

```bash
npm i -g vernclaw-connect-cli
vernclaw-cli login
```

## Invocation

```bash
vernclaw-cli invoke seo.keyword-suggestions --keywords "openai" --market us --language english
```

## Parameters

| Flag         | Required | Description                                  |
| ------------ | -------- | -------------------------------------------- |
| `--keywords` | Yes      | Seed keyword or comma-separated keyword list |
| `--market`   | No       | Market code such as `us`                     |
| `--language` | No       | Language name such as `english`              |

## Output

Markdown to `stdout` containing `Seed Keywords`, `Suggestion Count`, `Top Suggestion`, and `Top Suggestion Volume`.

Execution mode: **synchronous**.
