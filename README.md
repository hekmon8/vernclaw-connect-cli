# vernclaw-connect-cli

Official command-line interface for [Vernclaw Connectors](https://vernclaw.com/connectors) — query SEO metrics, read social media content, and generate images from your terminal with Markdown-first output.

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

## Commands

| Command | Description |
|---------|-------------|
| `vernclaw-cli login` | Authenticate via browser or API key |
| `vernclaw-cli logout` | Remove stored credentials |
| `vernclaw-cli list` | List available connectors |
| `vernclaw-cli describe <connectorId>` | Show connector details and parameters |
| `vernclaw-cli invoke <connectorId> [flags]` | Run a connector and print Markdown output |
| `vernclaw-cli job get <jobId>` | Check status of an async job |
| `vernclaw-cli status` | Display current login, subscription, and credit status |

## Available Connectors

| Connector ID | Category | Mode | Skill |
|--------------|----------|------|-------|
| `seo.domain-authority` | SEO | sync | [EN](./skills/domain-authority-get.md) / [中文](./skills/domain-authority-get.zh.md) |
| `seo.website-traffic` | SEO | sync | [EN](./skills/website-traffic-get.md) / [中文](./skills/website-traffic-get.zh.md) |
| `read.x.post` | Social | sync | [EN](./skills/x-post-read.md) / [中文](./skills/x-post-read.zh.md) |
| `generate.image` | AI | async | [EN](./skills/image-generate.md) / [中文](./skills/image-generate.zh.md) |

## Quick Examples

```bash
# Check domain authority
vernclaw-cli invoke seo.domain-authority --domain example.com

# Estimate website traffic
vernclaw-cli invoke seo.website-traffic --domain example.com

# Read an X/Twitter post
vernclaw-cli invoke read.x.post --url "https://x.com/user/status/123"

# Generate an image (async — returns a job ID)
vernclaw-cli invoke generate.image --prompt "sunset over mountains"
vernclaw-cli job get img_abc123

# Check account status
vernclaw-cli status
```

## Output Contract

All connector output is **Markdown-first**: structured Markdown is printed to `stdout`. Error metadata is written to `stderr` as `ERROR_CODE=<code>`.

### Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Success |
| `1` | Business rejection (e.g. insufficient credits) |
| `2` | Authentication failure |
| `3` | Invalid parameters |
| `4` | Provider failure |

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
```

Use `VERNCLAW_E2E_RUN=1` together with `VERNCLAW_E2E_API_KEY` and optionally `VERNCLAW_E2E_API_BASE_URL` to enable the production e2e smoke test.

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
