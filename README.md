# vernclaw-connect-cli

Official command-line interface for [Vernclaw Connectors](https://vernclaw.com/connectors) — query SEO metrics, read social media content, and generate images from your terminal with JSON-first output.

[![npm](https://img.shields.io/npm/v/vernclaw-connect-cli)](https://www.npmjs.com/package/vernclaw-connect-cli)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

## Install

```bash
npm i -g vernclaw-connect-cli
```

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
| `vernclaw-cli invoke <connectorId> [flags]` | Run a connector and print JSON output                  |
| `vernclaw-cli job get <jobId>`              | Check status of an async job                           |
| `vernclaw-cli status`                       | Display current login, subscription, and credit status |

## Available Connectors

| Connector ID                | Category | Mode  | Skill                                                                                          |
| --------------------------- | -------- | ----- | ---------------------------------------------------------------------------------------------- |
| `seo.domain-authority`      | SEO      | sync  | [EN](./skills/domain-authority-get.md) / [中文](./skills/domain-authority-get.zh.md)           |
| `seo.website-traffic`       | SEO      | sync  | [EN](./skills/website-traffic-get.md) / [中文](./skills/website-traffic-get.zh.md)             |
| `seo.backlinks`             | SEO      | sync  | [EN](./skills/backlinks-get.md) / [中文](./skills/backlinks-get.zh.md)                         |
| `seo.backlinks-summary`     | SEO      | sync  | [EN](./skills/backlinks-summary-get.md) / [中文](./skills/backlinks-summary-get.zh.md)         |
| `seo.serp-google-organic`   | SEO      | sync  | [EN](./skills/serp-google-organic-get.md) / [中文](./skills/serp-google-organic-get.zh.md)     |
| `seo.google-trends`         | SEO      | sync  | [EN](./skills/google-trends-get.md) / [中文](./skills/google-trends-get.zh.md)                   |
| `seo.domain-rank-overview`  | SEO      | sync  | [EN](./skills/domain-rank-overview-get.md) / [中文](./skills/domain-rank-overview-get.zh.md) |
| `seo.keyword-search-volume` | SEO      | sync  | [EN](./skills/keyword-search-volume-get.md) / [中文](./skills/keyword-search-volume-get.zh.md) |
| `seo.keyword-suggestions`   | SEO      | sync  | [EN](./skills/keyword-suggestions-get.md) / [中文](./skills/keyword-suggestions-get.zh.md)     |
| `seo.site-keywords`         | SEO      | sync  | [EN](./skills/site-keywords-get.md) / [中文](./skills/site-keywords-get.zh.md)                 |
| `seo.site-technologies`     | SEO      | sync  | [EN](./skills/site-technologies-get.md) / [中文](./skills/site-technologies-get.zh.md)         |
| `seo.domain-whois`          | SEO      | sync  | [EN](./skills/domain-whois-get.md) / [中文](./skills/domain-whois-get.zh.md)                   |
| `read.x.post`               | Social   | sync  | [EN](./skills/x-post-read.md) / [中文](./skills/x-post-read.zh.md)                             |
| `generate.image`            | AI       | async | [EN](./skills/image-generate.md) / [中文](./skills/image-generate.zh.md)                       |

## Quick Examples

```bash
# Check domain authority
vernclaw-cli invoke seo.domain-authority --domain example.com

# Estimate website traffic
vernclaw-cli invoke seo.website-traffic --domain example.com

# Expand a seed keyword
vernclaw-cli invoke seo.keyword-suggestions --keywords "openai" --market us --language english

# Review a domain's keyword footprint
vernclaw-cli invoke seo.site-keywords --target openai.com --market us --language english

# Inspect live Google organic results
vernclaw-cli invoke seo.serp-google-organic --keyword "openai" --market us --language english --device desktop --os windows --depth 5

# Inspect keyword trend trajectory
vernclaw-cli invoke seo.google-trends --keywords "openai" --market us --language english

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

# Generate an image (async — returns a job ID)
vernclaw-cli invoke generate.image --prompt "sunset over mountains"
vernclaw-cli job get img_abc123

# Check account status
vernclaw-cli status
```

## Output Contract

All connector output is **JSON-first**: a JSON envelope is printed to `stdout` by default. Add `--pretty` to print human-readable Markdown instead. Error metadata is written to `stderr` as `ERROR_CODE=<code>`.

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
