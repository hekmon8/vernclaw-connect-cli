# vernclaw-connect-cli

Official command-line interface for [Vernclaw Connectors](https://vernclaw.com/connectors). Vernclaw Connect CLI gives AI agents and automation scripts JSON-first access to SEO metrics, YouTube research, X/Twitter readers, Product Hunt discovery, web search, URL extraction, and AI image generation.

[![npm](https://img.shields.io/npm/v/vernclaw-connect-cli)](https://www.npmjs.com/package/vernclaw-connect-cli)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![skills.sh](https://skills.sh/b/hekmon8/vernclaw-connect-cli)](https://skills.sh/hekmon8/vernclaw-connect-cli)

## Install

```bash
npm i -g vernclaw-connect-cli
```

## Use as Agent Skills

Each connector ships as an [Agent Skill](https://skills.sh/) (a `SKILL.md` under [`skills/`](./skills)). Install them straight into your AI agent:

```bash
npx skills add hekmon8/vernclaw-connect-cli
```

Listed on the agent-skill ecosystem: [skills.sh](https://skills.sh/hekmon8/vernclaw-connect-cli) · [AgentSkillsHub](https://agentskillshub.dev/) · [MCP Servers](https://mcpservers.org/).

## Authentication

**Browser login** (recommended for interactive use):

```bash
vernclaw-cli login
```

Opens your browser for device-code authorization. Credentials are stored locally at `~/.vernclaw-cli.json`.

**API key login** (for CI/CD and headless environments):

```bash
vernclaw-cli login --api-key YOUR_API_KEY
```

Generate an API key at [vernclaw.com/settings/connectors](https://vernclaw.com/settings/connectors) (sign in → Connector Settings → Create API Key).

By default, the CLI targets `https://vernclaw.com`. For local or self-hosted environments, pass `--api-base-url` or set `VERNCLAW_CLI_API_BASE_URL`.

## Managed Connector Access

Most CLI users only need Vernclaw authentication. Connector access is managed by Vernclaw, so individual CLI users do not need to configure separate service credentials.

## Local Development Against a Local Vernclaw App

```bash
pnpm dev:connectors:local
pnpm install:cli:local
vernclaw-cli login --api-base-url http://localhost:3000 --api-key YOUR_API_KEY
vernclaw-cli list
```

The `login` command stores the local `apiBaseUrl` in `~/.vernclaw-cli.json`, so follow-up commands keep targeting your local app until you log in again against another environment.

## Commands

| Command                                     | Description                                            |
| ------------------------------------------- | ------------------------------------------------------ |
| `vernclaw-cli login`                        | Authenticate via browser or API key                    |
| `vernclaw-cli logout`                       | Remove stored credentials                              |
| `vernclaw-cli list`                         | List available connectors                              |
| `vernclaw-cli describe <connectorId>`       | Show connector details and parameters                  |
| `vernclaw-cli invoke <connectorId> [flags]` | Run a connector and print connector output             |
| `vernclaw-cli job get <jobId>`              | Check status of an async job                           |
| `vernclaw-cli status`                       | Display current login, subscription, and credit status |

`list` prints a human-readable connector table by default. Use `vernclaw-cli list --json` when an agent or script needs the structured catalog payload.

## Available Connectors

| Connector ID                | Category | Mode  | Skill                                                         |
| --------------------------- | -------- | ----- | ------------------------------------------------------------- |
| `generate.image`            | AI       | async | [Skill](./skills/vernclaw-image-generate/SKILL.md)            |
| `seo.website-traffic`       | SEO      | sync  | [Skill](./skills/vernclaw-website-traffic-get/SKILL.md)       |
| `seo.backlinks`             | SEO      | sync  | [Skill](./skills/vernclaw-backlinks-get/SKILL.md)             |
| `seo.serp-google-organic`   | SEO      | sync  | [Skill](./skills/vernclaw-serp-google-organic-get/SKILL.md)   |
| `seo.google-trends`         | SEO      | sync  | [Skill](./skills/vernclaw-google-trends-get/SKILL.md)         |
| `seo.keyword-search-volume` | SEO      | sync  | [Skill](./skills/vernclaw-keyword-search-volume-get/SKILL.md) |
| `seo.keyword-suggestions`   | SEO      | sync  | [Skill](./skills/vernclaw-keyword-suggestions-get/SKILL.md)   |
| `seo.site-keywords`         | SEO      | sync  | [Skill](./skills/vernclaw-site-keywords-get/SKILL.md)         |
| `seo.site-technologies`     | SEO      | sync  | [Skill](./skills/vernclaw-site-technologies-get/SKILL.md)     |
| `seo.backlinks-summary`     | SEO      | sync  | [Skill](./skills/vernclaw-backlinks-summary-get/SKILL.md)     |
| `seo.domain-rank-overview`  | SEO      | sync  | [Skill](./skills/vernclaw-domain-rank-overview-get/SKILL.md)  |
| `seo.domain-whois`          | SEO      | sync  | [Skill](./skills/vernclaw-domain-whois-get/SKILL.md)          |
| `seo.domain-authority`      | SEO      | sync  | [Skill](./skills/vernclaw-domain-authority-get/SKILL.md)      |
| `read.x.post`               | Social   | sync  | [Skill](./skills/vernclaw-x-post-read/SKILL.md)               |
| `read.x.replies`            | Social   | sync  | [Skill](./skills/vernclaw-x-post-replies-read/SKILL.md)       |
| `read.x.article`            | Social   | sync  | [Skill](./skills/vernclaw-x-article-read/SKILL.md)            |
| `search.x`                  | Social   | sync  | [Skill](./skills/vernclaw-x-search/SKILL.md)                  |
| `search.tiktok`             | Social   | sync  | [Skill](./skills/vernclaw-tiktok-search/SKILL.md)             |
| `read.tiktok.video`         | Social   | sync  | [Skill](./skills/vernclaw-tiktok-video-read/SKILL.md)         |
| `search.instagram`          | Social   | sync  | [Skill](./skills/vernclaw-instagram-search/SKILL.md)          |
| `read.instagram.post`       | Social   | sync  | [Skill](./skills/vernclaw-instagram-post-read/SKILL.md)       |
| `social.tiktok`             | Social   | sync  | [Skill](./skills/vernclaw-tiktok-social-data/SKILL.md)        |
| `social.douyin`             | Social   | sync  | [Skill](./skills/vernclaw-douyin-social-data/SKILL.md)        |
| `social.instagram`          | Social   | sync  | [Skill](./skills/vernclaw-instagram-social-data/SKILL.md)     |
| `social.linkedin`           | Social   | sync  | [Skill](./skills/vernclaw-linkedin-social-data/SKILL.md)      |
| `social.reddit`             | Social   | sync  | [Skill](./skills/vernclaw-reddit-social-data/SKILL.md)        |
| `social.threads`            | Social   | sync  | [Skill](./skills/vernclaw-threads-social-data/SKILL.md)       |
| `social.wechat`             | Social   | sync  | [Skill](./skills/vernclaw-wechat-social-data/SKILL.md)        |
| `social.weibo`              | Social   | sync  | [Skill](./skills/vernclaw-weibo-social-data/SKILL.md)         |
| `social.xiaohongshu`        | Social   | sync  | [Skill](./skills/vernclaw-xiaohongshu-social-data/SKILL.md)   |
| `social.youtube`            | Social   | sync  | [Skill](./skills/vernclaw-youtube-social-data/SKILL.md)       |
| `social.zhihu`              | Social   | sync  | [Skill](./skills/vernclaw-zhihu-social-data/SKILL.md)         |
| `search.youtube`            | Video    | sync  | [Skill](./skills/vernclaw-youtube-search/SKILL.md)            |
| `read.youtube.video`        | Video    | sync  | [Skill](./skills/vernclaw-youtube-video-read/SKILL.md)        |
| `search.producthunt`        | Product  | sync  | [Skill](./skills/vernclaw-producthunt-search/SKILL.md)        |
| `list.producthunt.launches` | Product  | sync  | [Skill](./skills/vernclaw-producthunt-launches-list/SKILL.md) |
| `search.web`                | Search   | sync  | [Skill](./skills/vernclaw-web-search/SKILL.md)                |
| `extract.url`               | Extract  | sync  | [Skill](./skills/vernclaw-url-extract/SKILL.md)               |

## Quick Examples

```bash
# Check domain authority
vernclaw-cli invoke seo.domain-authority --domain example.com

# Estimate website traffic
vernclaw-cli invoke seo.website-traffic --domain example.com

# Expand a seed keyword
vernclaw-cli invoke seo.keyword-suggestions --keywords "openai" --market us --language english
vernclaw-cli invoke seo.keyword-suggestions --keywords "openai" --market us --limit 20

# Review a domain's keyword footprint
vernclaw-cli invoke seo.site-keywords --target openai.com --market us --language english
vernclaw-cli invoke seo.site-keywords --target openai.com --market us --all

# Inspect live Google organic results
vernclaw-cli invoke seo.serp-google-organic --keyword "openai" --market us --language english --device desktop --os windows --depth 5

# Inspect keyword trend trajectory
vernclaw-cli invoke seo.google-trends --keywords "openai" --market us --language english
vernclaw-cli invoke seo.google-trends --keywords "openai" --market us --points 50
vernclaw-cli invoke seo.google-trends --keywords "translator" --market us --language english --time-range past_7_days --type web --item-types google_trends_queries_list
vernclaw-cli invoke seo.google-trends --keywords "mcp server,translator" --market us --language english --time-range past_30_days --item-types google_trends_graph

# Fetch backlink summary snapshot
vernclaw-cli invoke seo.backlinks-summary --target openai.com

# Check domain rank overview
vernclaw-cli invoke seo.domain-rank-overview --target openai.com --market us

# Detect public technologies
vernclaw-cli invoke seo.site-technologies --target openai.com

# Inspect Whois timestamps
vernclaw-cli invoke seo.domain-whois --target openai.com

# Read an X/Twitter post
vernclaw-cli invoke read.x.post --url "https://x.com/user/status/123"

# Search YouTube videos
vernclaw-cli invoke search.youtube --query "AI agent workflows" --limit 5 --order date --region-code US

# Read YouTube video metadata; replace VIDEO_ID_HERE before running
vernclaw-cli invoke read.youtube.video --url "https://www.youtube.com/watch?v=VIDEO_ID_HERE"

# Search Product Hunt launches
vernclaw-cli invoke search.producthunt --query "AI agents" --limit 5

# Search the web or extract a URL
vernclaw-cli invoke search.web --query "Vernclaw connector CLI" --limit 5
vernclaw-cli invoke extract.url --url "https://vernclaw.com/connectors"

# Generate an image (async — returns a job ID)
vernclaw-cli invoke generate.image --prompt "sunset over mountains"
vernclaw-cli job get img_abc123

# Check account status
vernclaw-cli status
```

## Output Contract

Connector success and provider responses are **JSON-first**: a compact JSON envelope with `status` and `data` is printed to `stdout` by default. Add `--pretty` to print human-readable terminal text instead. Local `invoke` parameter validation errors also return compact JSON by default. Error codes are exposed through the top-level `errorCode` field and, for API responses, the `x-error-code` header.

Connector output is optimized for agents: default `invoke` responses omit connector metadata, echoed input, provider names, and full upstream `raw` payloads. Metric tools return `data.summary` plus `data.metrics`; list tools return `data.summary`, `data.stats`, and `data.items`; trend tools return `data.stats`, `data.metrics`, and `data.series`; extract tools return `data.document`. Use `vernclaw-cli list --json` for structured catalog discovery.

### Exit Codes

| Code | Meaning                                        |
| ---- | ---------------------------------------------- |
| `0`  | Success                                        |
| `1`  | Business rejection (e.g. insufficient credits) |
| `2`  | Authentication failure                         |
| `3`  | Invalid parameters                             |
| `4`  | Provider failure                               |

## Development

```bash
npm install
npm run build
```

Compiles `src` into `dist`.

## Testing

```bash
npm test
VERNCLAW_E2E_RUN=1 VERNCLAW_E2E_API_KEY=your_key npx vitest run __tests__/e2e.production.test.ts
VERNCLAW_E2E_RUN=1 VERNCLAW_E2E_API_KEY=your_key pnpm test:e2e:cli:local
VERNCLAW_E2E_API_KEY=your_key pnpm test:e2e:cli:prod
```

Use `VERNCLAW_E2E_RUN=1` together with `VERNCLAW_E2E_API_KEY` and optionally `VERNCLAW_E2E_API_BASE_URL` to enable the live e2e smoke test. `pnpm test:e2e:cli:local` assumes a local app is already running on `http://127.0.0.1:3000`, preferably via `pnpm dev:connectors:local`.

`pnpm test:e2e:cli:prod` now runs as a production success gate: it forces `VERNCLAW_E2E_RUN=1`, defaults `VERNCLAW_E2E_EXPECT_SUCCESS=1`, and fails fast when `VERNCLAW_E2E_API_KEY` is missing.

## Publish / Deploy

```bash
npm pack --dry-run
npm publish
```

`npm publish` triggers `prepack`, which rebuilds `dist` before publishing. `dist` is treated as a generated publish artifact and is not tracked in git.

## Links

- **Website**: <https://vernclaw.com>
- **Connector catalog**: <https://vernclaw.com/connectors>
- **Connector docs**: <https://vernclaw.com/docs/connectors>
- **CLI docs**: <https://vernclaw.com/docs/connectors/cli>
- **npm**: <https://www.npmjs.com/package/vernclaw-connect-cli>
- **GitHub**: <https://github.com/hekmon8/vernclaw-connect-cli>

## License

MIT
