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
        resultFormat: 'json' as const,
        structuredPayload: 'optional' as const,
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
      description:
        'Estimate website traffic, top markets, and primary acquisition channels.',
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
      description: 'Fetch live backlink rows for a target domain.',
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
      id: 'seo.backlinks-summary',
      name: 'Backlinks Summary Get',
      category: 'seo',
      description:
        'Fetch aggregate backlink summary metrics for a target domain.',
      connectorType: 'read_only',
      inputSchema: buildInputSchema(
        {
          target: {
            type: 'string',
            description: 'Target root domain to inspect.',
          },
          limit: {
            type: 'number',
            description: 'Optional number of rows sampled in summary inputs.',
          },
          offset: {
            type: 'number',
            description: 'Optional summary pagination offset.',
          },
        },
        ['target']
      ),
    }),
    bootstrapConnector({
      id: 'seo.serp-google-organic',
      name: 'SERP Google Organic Get',
      category: 'seo',
      description: 'Fetch live Google organic SERP snapshots for a keyword.',
      connectorType: 'read_only',
      inputSchema: buildInputSchema(
        {
          keyword: {
            type: 'string',
            description: 'Keyword to query.',
          },
          market: {
            type: 'string',
            description: 'Optional market code such as us.',
          },
          language: {
            type: 'string',
            description: 'Optional language name such as english.',
          },
          device: {
            type: 'string',
            description: 'Optional device type such as desktop or mobile.',
          },
          os: {
            type: 'string',
            description: 'Optional OS name such as windows.',
          },
          depth: {
            type: 'number',
            description: 'Optional result depth.',
          },
        },
        ['keyword']
      ),
    }),
    bootstrapConnector({
      id: 'seo.google-trends',
      name: 'Google Trends Get',
      category: 'seo',
      description:
        'Fetch trend indicator points for one or more keywords. Synchronous requests may wait up to 60 seconds when upstream trend data is slow.',
      connectorType: 'read_only',
      inputSchema: buildInputSchema(
        {
          keywords: {
            type: 'string',
            description:
              'Seed keyword or comma-separated keyword list. Maximum 5 keywords; any extras are truncated automatically.',
          },
          market: {
            type: 'string',
            description: 'Optional market code such as us.',
          },
          language: {
            type: 'string',
            description: 'Optional language name such as english.',
          },
          'time-range': {
            type: 'string',
            description:
              'Optional preset range such as past_7_days or past_30_days.',
            enum: [
              'past_hour',
              'past_4_hours',
              'past_day',
              'past_7_days',
              'past_30_days',
              'past_90_days',
              'past_12_months',
              'past_5_years',
              '2004_present',
              '2008_present',
            ],
          },
          'date-from': {
            type: 'string',
            description: 'Optional custom start date in YYYY-MM-DD format.',
          },
          'date-to': {
            type: 'string',
            description: 'Optional custom end date in YYYY-MM-DD format.',
          },
          type: {
            type: 'string',
            description: 'Optional Google Trends type.',
            enum: ['web', 'news', 'youtube', 'images', 'froogle'],
          },
          'category-code': {
            type: 'number',
            description: 'Optional Google Trends category code.',
          },
          'item-types': {
            type: 'array',
            description:
              'Optional item types such as google_trends_graph or google_trends_queries_list.',
            enum: [
              'google_trends_graph',
              'google_trends_map',
              'google_trends_topics_list',
              'google_trends_queries_list',
            ],
          },
          points: {
            type: 'number',
            description: 'Optional trend point count. Defaults to 20.',
          },
          all: {
            type: 'boolean',
            description: 'Return all normalized trend points.',
          },
        },
        ['keywords']
      ),
    }),
    bootstrapConnector({
      id: 'seo.keyword-search-volume',
      name: 'Keyword Search Volume Get',
      category: 'seo',
      description:
        'Fetch search volume and competition signals for keyword seeds.',
      connectorType: 'read_only',
      inputSchema: buildInputSchema(
        {
          keywords: {
            type: 'string',
            description: 'Seed keyword or comma-separated keyword list.',
          },
          market: {
            type: 'string',
            description: 'Optional market code such as us.',
          },
          language: {
            type: 'string',
            description: 'Optional language name such as english.',
          },
          limit: {
            type: 'number',
            description: 'Optional normalized row count. Defaults to 10.',
          },
          all: {
            type: 'boolean',
            description: 'Return all normalized rows.',
          },
        },
        ['keywords']
      ),
    }),
    bootstrapConnector({
      id: 'seo.keyword-suggestions',
      name: 'Keyword Suggestions Get',
      category: 'seo',
      description:
        'Generate keyword suggestions from one or more seed keywords.',
      connectorType: 'read_only',
      inputSchema: buildInputSchema(
        {
          keywords: {
            type: 'string',
            description: 'Seed keyword or comma-separated keyword list.',
          },
          market: {
            type: 'string',
            description: 'Optional market code such as us.',
          },
          language: {
            type: 'string',
            description: 'Optional language name such as english.',
          },
          limit: {
            type: 'number',
            description: 'Optional normalized row count. Defaults to 10.',
          },
          all: {
            type: 'boolean',
            description: 'Return all normalized rows.',
          },
        },
        ['keywords']
      ),
    }),
    bootstrapConnector({
      id: 'seo.site-keywords',
      name: 'Site Keywords Get',
      category: 'seo',
      description: 'Fetch ranked keyword data for a target domain.',
      connectorType: 'read_only',
      inputSchema: buildInputSchema(
        {
          target: {
            type: 'string',
            description: 'Target root domain to inspect.',
          },
          market: {
            type: 'string',
            description: 'Optional market code such as us.',
          },
          language: {
            type: 'string',
            description: 'Optional language name such as english.',
          },
          limit: {
            type: 'number',
            description: 'Optional normalized row count. Defaults to 10.',
          },
          all: {
            type: 'boolean',
            description: 'Return all normalized rows.',
          },
        },
        ['target']
      ),
    }),
    bootstrapConnector({
      id: 'seo.domain-rank-overview',
      name: 'Domain Rank Overview Get',
      category: 'seo',
      description: 'Fetch aggregate domain rank overview metrics.',
      connectorType: 'read_only',
      inputSchema: buildInputSchema(
        {
          target: {
            type: 'string',
            description: 'Target domain to inspect.',
          },
          market: {
            type: 'string',
            description: 'Optional market code such as us.',
          },
          language: {
            type: 'string',
            description: 'Optional language name such as english.',
          },
        },
        ['target']
      ),
    }),
    bootstrapConnector({
      id: 'seo.domain-whois',
      name: 'Whois Get',
      category: 'seo',
      description: 'Inspect public domain registration metadata.',
      connectorType: 'read_only',
      inputSchema: buildInputSchema(
        {
          target: {
            type: 'string',
            description: 'Root domain to inspect.',
          },
        },
        ['target']
      ),
    }),
    bootstrapConnector({
      id: 'seo.domain-authority',
      name: 'Domain Rating Get',
      category: 'seo',
      description: 'Inspect DR, referring domains, and backlink counts.',
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
      description: 'Read and summarize a public X/Twitter post.',
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
      description:
        'Read public replies for a referenced X post through twitterapi.io.',
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
      description:
        'Read public X article pages with normalized title, author, and excerpt output.',
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
      description:
        'Run advanced X search queries and normalize the top matching public posts.',
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
      id: 'search.youtube',
      name: 'YouTube Search',
      category: 'social-readers',
      description:
        'Search public YouTube videos and return normalized metadata, metrics, and source limitations.',
      connectorType: 'read_only',
      inputSchema: buildInputSchema(
        {
          query: {
            type: 'string',
            description: 'Keyword query to search on YouTube.',
          },
          limit: {
            type: 'number',
            description: 'Optional number of videos to return.',
          },
          order: {
            type: 'string',
            description:
              'Optional YouTube order: date, rating, relevance, title, or viewCount.',
          },
          region_code: {
            type: 'string',
            description: 'Optional ISO 3166-1 alpha-2 region code, such as US.',
          },
          relevance_language: {
            type: 'string',
            description: 'Optional relevance language, such as en or zh-Hans.',
          },
        },
        ['query']
      ),
    }),
    bootstrapConnector({
      id: 'read.youtube.video',
      name: 'YouTube Video Read',
      category: 'social-readers',
      description:
        'Read a public YouTube video by URL or ID and return normalized metadata and metrics.',
      connectorType: 'read_only',
      inputSchema: buildInputSchema(
        {
          url: {
            type: 'string',
            description: 'Public YouTube video URL.',
          },
          id: {
            type: 'string',
            description: 'Optional 11-character YouTube video ID.',
          },
        },
        []
      ),
    }),
    bootstrapConnector({
      id: 'search.producthunt',
      name: 'Product Hunt Search',
      category: 'social-readers',
      description:
        'Search Product Hunt launches and return normalized product evidence rows.',
      connectorType: 'read_only',
      inputSchema: buildInputSchema(
        {
          query: {
            type: 'string',
            description: 'Keyword query to search Product Hunt launches.',
          },
          limit: {
            type: 'number',
            description: 'Optional number of launches to return.',
          },
          from_date: {
            type: 'string',
            description: 'Optional lower date bound in YYYY-MM-DD format.',
          },
          to_date: {
            type: 'string',
            description: 'Optional upper date bound in YYYY-MM-DD format.',
          },
          sort: {
            type: 'string',
            description: 'Optional managed provider sort mode.',
          },
        },
        ['query']
      ),
    }),
    bootstrapConnector({
      id: 'list.producthunt.launches',
      name: 'Product Hunt Launches List',
      category: 'social-readers',
      description:
        'List Product Hunt launches for a date or date window and return normalized rows.',
      connectorType: 'read_only',
      inputSchema: buildInputSchema(
        {
          date: {
            type: 'string',
            description: 'Optional launch date in YYYY-MM-DD format.',
          },
          from_date: {
            type: 'string',
            description: 'Optional lower date bound in YYYY-MM-DD format.',
          },
          to_date: {
            type: 'string',
            description: 'Optional upper date bound in YYYY-MM-DD format.',
          },
          limit: {
            type: 'number',
            description: 'Optional number of launches to return.',
          },
          featured_only: {
            type: 'boolean',
            description: 'Optional flag to request featured launches only.',
          },
        },
        []
      ),
    }),
    bootstrapConnector({
      id: 'search.web',
      name: 'Web Search',
      category: 'search',
      description: 'Search the open web and return ranked result summaries.',
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
      description:
        'Extract readable main content from XiaoHongShu and other web pages.',
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
