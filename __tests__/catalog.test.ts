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
              id: 'website_traffic_get',
              name: 'Website Traffic',
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
              connectorId: 'website_traffic_get',
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
        id: 'website_traffic_get',
        compatibilityState: 'visible_upgrade_required',
        installStatus: 'upgrade_required',
      }),
    ]);
  });

  it('renders a table with effective install and runtime states', async () => {
    const { renderCatalogTable } = await import('../src/catalog/render.js');

    const output = renderCatalogTable([
      {
        id: 'website_traffic_get',
        name: 'website_traffic_get',
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
          id: 'website_traffic_get',
          name: 'website_traffic_get',
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
        id: 'image_generate',
        name: 'image_generate',
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
          id: 'image_generate',
          name: 'image_generate',
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

    expect(output).toContain('NAME');
    expect(output).toContain('website_traffic_get');
    expect(output).toContain('upgrade_required');
  });
});
