const REQUIRED_FEATURES = ['registry_v1', 'invoke_v1'];
function bootstrapConnector(id, category, description, connectorType) {
    return {
        manifest: {
            id,
            name: id,
            category,
            description,
            version: '1.0.0',
            connectorType,
            minCliVersion: '0.1.0',
            requiredCliFeatures: [...REQUIRED_FEATURES],
            inputSchema: {},
            outputContract: {
                mode: 'sync_result',
                resultFormat: 'markdown',
                structuredPayload: 'none',
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
export const BUILTIN_BOOTSTRAP_CATALOG = {
    registrySchema: '1.3',
    registryVersion: 'builtin-0.1.0',
    connectors: [
        bootstrapConnector('website_traffic_get', 'seo', 'Website traffic lookup', 'read_only'),
        bootstrapConnector('domain_authority_get', 'seo', 'Domain authority lookup', 'read_only'),
        bootstrapConnector('backlinks_get', 'seo', 'Backlink lookup', 'read_only'),
        bootstrapConnector('x_post_read', 'social', 'Read a public X post', 'read_only'),
        bootstrapConnector('x_post_replies_read', 'social', 'Read replies for a public X post', 'read_only'),
        bootstrapConnector('x_article_read', 'social', 'Read a public X article', 'read_only'),
        bootstrapConnector('x_search', 'social', 'Search public X content', 'read_only'),
        bootstrapConnector('web_search', 'search', 'Search the web', 'read_only'),
        bootstrapConnector('url_extract', 'search', 'Extract a URL into markdown', 'read_only'),
        bootstrapConnector('image_generate', 'generation', 'Generate an image', 'generation'),
    ],
};
