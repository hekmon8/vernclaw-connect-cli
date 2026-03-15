import { describe, expect, it } from 'vitest';

describe('registry compatibility engine', () => {
  it('marks connectors requiring a newer CLI as visible upgrade required', async () => {
    const { buildEffectiveCatalog } = await import('../src/catalog/compat.js');

    const entries = buildEffectiveCatalog({
      cliVersion: '0.1.0',
      supportedRegistrySchemas: ['1.0'],
      supportedFeatures: ['registry_v1', 'invoke_v1'],
      catalog: {
        registrySchema: '1.0',
        registryVersion: '2026-03-12',
        connectors: [
          {
            manifest: {
              id: 'seo.website-traffic',
              name: 'SEO Website Traffic',
              category: 'seo',
              description: 'Traffic lookup',
              version: '1.0.0',
              connectorType: 'read_only',
              minCliVersion: '0.2.0',
              requiredCliFeatures: ['registry_v1'],
              inputSchema: {},
              outputContract: {
                mode: 'sync_result',
                resultFormat: 'markdown',
                structuredPayload: 'none',
              },
            },
            overlay: {
              connectorId: 'seo.website-traffic',
              visible: true,
              featured: false,
              emergencyDisable: false,
            },
          },
        ],
      },
    });

    expect(entries).toEqual([
      expect.objectContaining({
        id: 'seo.website-traffic',
        compatibilityState: 'visible_upgrade_required',
        installStatus: 'upgrade_required',
      }),
    ]);
  });

  it('renders a table with effective install and runtime states', async () => {
    const { renderCatalogTable } = await import('../src/catalog/render.js');

    const output = renderCatalogTable([
      {
        id: 'seo.website-traffic',
        name: 'seo.website-traffic',
        category: 'seo',
        description: 'Traffic lookup',
        version: '1.0.0',
        minCliVersion: '0.1.0',
        visibility: 'visible',
        compatibilityState: 'supported',
        installStatus: 'installable',
        runtimeStatus: 'active',
        authStatus: 'not_required',
        trainingStatus: 'not_required',
        source: 'remote',
        manifest: {
          id: 'seo.website-traffic',
          name: 'seo.website-traffic',
          category: 'seo',
          description: 'Traffic lookup',
          version: '1.0.0',
          connectorType: 'read_only',
          minCliVersion: '0.1.0',
          requiredCliFeatures: ['registry_v1'],
          inputSchema: {},
          outputContract: {
            mode: 'sync_result',
            resultFormat: 'markdown',
            structuredPayload: 'none',
          },
        },
      },
      {
        id: 'generate.image',
        name: 'generate.image',
        category: 'generation',
        description: 'Generate images',
        version: '1.0.0',
        minCliVersion: '0.2.0',
        visibility: 'visible',
        compatibilityState: 'visible_upgrade_required',
        installStatus: 'upgrade_required',
        runtimeStatus: 'unavailable',
        authStatus: 'unknown',
        trainingStatus: 'unknown',
        source: 'cache',
        manifest: {
          id: 'generate.image',
          name: 'generate.image',
          category: 'generation',
          description: 'Generate images',
          version: '1.0.0',
          connectorType: 'generation',
          minCliVersion: '0.2.0',
          requiredCliFeatures: ['registry_v1'],
          inputSchema: {},
          outputContract: {
            mode: 'sync_result',
            resultFormat: 'markdown',
            structuredPayload: 'none',
          },
        },
      },
    ]);

    expect(output).toContain('CONNECTOR');
    expect(output).toContain('seo.website-traffic');
    expect(output).toContain('upgrade_required');
  });
});
