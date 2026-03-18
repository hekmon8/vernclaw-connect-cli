import type { ConnectorRegistryCatalog } from './types.js';

const REQUIRED_FEATURES = ['registry_v1', 'invoke_v1'];

function buildInputSchema(
  properties: Record<string, Record<string, unknown>>,
  required: string[]
) {
  return {
    type: 'object',
    properties,
    required,
  };
}

function bootstrapConnector({
  id,
  name,
  category,
  description,
  connectorType,
  inputSchema,
}: {
  id: string;
  name: string;
  category: string;
  description: string;
  connectorType: string;
  inputSchema: Record<string, unknown>;
}) {
  return {
    manifest: {
      id,
      name,
      category,
      description,
      version: '1.0.0',
      connectorType,
      minCliVersion: '0.1.0',
      requiredCliFeatures: [...REQUIRED_FEATURES],
      inputSchema,
      outputContract: {
        mode: 'sync_result' as const,
        resultFormat: 'markdown' as const,
        structuredPayload: 'none' as const,
      },
    },
    overlay: {
      connectorId: id,
      visible: true,
      featured: false,
      emergencyDisable: false,
    },
  };
}

export const BUILTIN_BOOTSTRAP_CATALOG: ConnectorRegistryCatalog = {
  registrySchema: '1.3',
  registryVersion: 'builtin-0.1.0',
  connectors: [
    bootstrapConnector({
      id: 'generate.image',
      name: 'Image Generate',
      category: 'content-generation',
      description: 'Generate production-ready images from a prompt.',
      connectorType: 'generation',
      inputSchema: buildInputSchema(
        {
          prompt: {
            type: 'string',
            description: 'Prompt describing the desired image.',
          },
          size: {
            type: 'string',
            description: 'Optional size such as 1024x1024 or 1792x1024.',
          },
        },
        ['prompt']
      ),
    }),
    bootstrapConnector({
      id: 'seo.website-traffic',
      name: 'Website Traffic Get',
      category: 'seo',
      description: 'Estimate website traffic, top markets, and primary acquisition channels.',
      connectorType: 'read_only',
      inputSchema: buildInputSchema(
        {
          domain: {
            type: 'string',
            description: 'Root domain to inspect, such as example.com.',
          },
          market: {
            type: 'string',
            description: 'Optional market code, such as us.',
          },
        },
        ['domain']
      ),
    }),
    bootstrapConnector({
      id: 'seo.backlinks',
      name: 'Backlinks Get',
      category: 'seo',
      description: 'Fetch live backlink rows for a target domain from DataForSEO Backlinks API.',
      connectorType: 'read_only',
      inputSchema: buildInputSchema(
        {
          target: {
            type: 'string',
            description: 'Target root domain to inspect.',
          },
          limit: {
            type: 'number',
            description: 'Optional number of backlinks to return.',
          },
        },
        ['target']
      ),
    }),
    bootstrapConnector({
      id: 'seo.domain-authority',
      name: 'Domain Rating Get',
      category: 'seo',
      description: 'Inspect DR, referring domains, and backlinks through the RapidAPI SEO endpoint.',
      connectorType: 'read_only',
      inputSchema: buildInputSchema(
        {
          domain: {
            type: 'string',
            description: 'Root domain to inspect.',
          },
        },
        ['domain']
      ),
    }),
    bootstrapConnector({
      id: 'read.x.post',
      name: 'X Post Read',
      category: 'social-readers',
      description: 'Read and summarize a public X/Twitter post with a compact Markdown result.',
      connectorType: 'read_only',
      inputSchema: buildInputSchema(
        {
          url: {
            type: 'string',
            description: 'Direct X/Twitter post URL.',
          },
        },
        ['url']
      ),
    }),
    bootstrapConnector({
      id: 'read.x.replies',
      name: 'X Post Replies Read',
      category: 'social-readers',
      description: 'Read public replies for a referenced X post through twitterapi.io.',
      connectorType: 'read_only',
      inputSchema: buildInputSchema(
        {
          url: {
            type: 'string',
            description: 'Direct X/Twitter post URL.',
          },
        },
        ['url']
      ),
    }),
    bootstrapConnector({
      id: 'read.x.article',
      name: 'X Article Read',
      category: 'social-readers',
      description: 'Read public X article pages with normalized title, author, and excerpt output.',
      connectorType: 'read_only',
      inputSchema: buildInputSchema(
        {
          url: {
            type: 'string',
            description: 'Public X article URL.',
          },
        },
        ['url']
      ),
    }),
    bootstrapConnector({
      id: 'search.x',
      name: 'X Search',
      category: 'social-readers',
      description: 'Run advanced X search queries and normalize the top matching public posts.',
      connectorType: 'read_only',
      inputSchema: buildInputSchema(
        {
          query: {
            type: 'string',
            description: 'Search query to run on X.',
          },
          limit: {
            type: 'number',
            description: 'Optional number of posts to return.',
          },
        },
        ['query']
      ),
    }),
    bootstrapConnector({
      id: 'search.web',
      name: 'Web Search',
      category: 'search',
      description: 'Search the open web with Exa, then fall back to Google Custom Search and Firecrawl search.',
      connectorType: 'read_only',
      inputSchema: buildInputSchema(
        {
          query: {
            type: 'string',
            description: 'Search query to run on the web.',
          },
          limit: {
            type: 'number',
            description: 'Optional number of results to return.',
          },
        },
        ['query']
      ),
    }),
    bootstrapConnector({
      id: 'extract.url',
      name: 'URL Extract',
      category: 'extraction',
      description: 'Extract readable main content from XiaoHongShu and other web pages through Firecrawl scrape.',
      connectorType: 'read_only',
      inputSchema: buildInputSchema(
        {
          url: {
            type: 'string',
            description: 'Public URL to extract.',
          },
        },
        ['url']
      ),
    }),
  ],
};
