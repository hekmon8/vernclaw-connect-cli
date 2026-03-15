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
        bootstrapConnector('seo.website-traffic', 'seo', 'Website traffic lookup', 'read_only'),
        bootstrapConnector('seo.domain-authority', 'seo', 'Domain authority lookup', 'read_only'),
        bootstrapConnector('seo.backlinks', 'seo', 'Backlink lookup', 'read_only'),
        bootstrapConnector('read.x.post', 'social', 'Read a public X post', 'read_only'),
        bootstrapConnector('read.x.replies', 'social', 'Read replies for a public X post', 'read_only'),
        bootstrapConnector('read.x.article', 'social', 'Read a public X article', 'read_only'),
        bootstrapConnector('search.x', 'social', 'Search public X content', 'read_only'),
        bootstrapConnector('search.web', 'search', 'Search the web', 'read_only'),
        bootstrapConnector('extract.url', 'search', 'Extract a URL into markdown', 'read_only'),
        bootstrapConnector('generate.image', 'generation', 'Generate an image', 'generation'),
    ],
};
