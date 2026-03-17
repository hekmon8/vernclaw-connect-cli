# vernclaw-connect-cli

Official CLI for Vernclaw connectors.

## Install

```bash
npm i -g vernclaw-connect-cli
```

After install, use the `vernclaw-cli` command:

```bash
vernclaw-cli list
```

## Authentication

Preferred environment variable:

```bash
export VERNCLAW_CLI_API_KEY="your_api_key"
```

Optional API base URL override:

```bash
export VERNCLAW_CLI_API_BASE_URL="https://vernclaw.com"
```

## Commands

- `vernclaw-cli login`
- `vernclaw-cli logout`
- `vernclaw-cli list`
- `vernclaw-cli describe <connectorId>`
- `vernclaw-cli invoke <connectorId> [flags]`
- `vernclaw-cli job get <jobId>`
- `vernclaw-cli balance`

## Output Contract

The CLI is markdown-first and prints markdown to stdout. Error code metadata is written to stderr as `ERROR_CODE=<code>`.

## Links

- npm: https://www.npmjs.com/package/vernclaw-connect-cli
- GitHub: https://github.com/hekmon8/vernclaw-connect-cli

## License

MIT
