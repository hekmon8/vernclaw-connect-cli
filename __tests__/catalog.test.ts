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

  it('renders a table with aggregated user-facing status values', async () => {
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
        installStatus: 'installable',
        runtimeStatus: 'not_installed',
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
    expect(output).toContain('ready');
    expect(output).toContain('setup required');
  });

  it('renders login required for supported connectors when viewer is unauthenticated', async () => {
    const { renderCatalogTable } = await import('../src/catalog/render.js');

    const output = renderCatalogTable(
      [
        {
          id: 'seo.website-traffic',
          name: 'seo.website-traffic',
          category: 'seo',
          description: 'Traffic lookup',
          version: '1.0.0',
          minCliVersion: '0.1.0',
          visibility: 'visible',
          compatibilityState: 'supported',
          installStatus: 'available',
          runtimeStatus: 'unknown',
          authStatus: 'unknown',
          trainingStatus: 'unknown',
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
            inputSchema: {
              type: 'object',
              required: ['domain'],
              properties: {
                domain: {
                  type: 'string',
                  description: 'Target domain',
                },
              },
            },
            outputContract: {
              mode: 'sync_result',
              resultFormat: 'markdown',
              structuredPayload: 'none',
            },
          },
        },
      ],
      false,
      { viewerState: 'unauthenticated' }
    );

    expect(output).toContain('login required');
  });

  it('renders cli flags and example command in describe output', async () => {
    const { renderCatalogDescribe } = await import('../src/catalog/render.js');

    const output = renderCatalogDescribe({
      id: 'seo.website-traffic',
      name: 'SEO Website Traffic',
      category: 'seo',
      description: 'Traffic lookup',
      version: '1.0.0',
      minCliVersion: '0.1.0',
      visibility: 'visible',
      compatibilityState: 'supported',
      installStatus: 'installable',
      runtimeStatus: 'not_installed',
      authStatus: 'not_required',
      trainingStatus: 'not_required',
      source: 'remote',
      manifest: {
        id: 'seo.website-traffic',
        name: 'SEO Website Traffic',
        category: 'seo',
        description: 'Traffic lookup',
        version: '1.0.0',
        connectorType: 'read_only',
        minCliVersion: '0.1.0',
        requiredCliFeatures: ['registry_v1'],
        inputSchema: {
          type: 'object',
          required: ['domain'],
          properties: {
            domain: {
              type: 'string',
              description: 'Target domain',
            },
            market: {
              type: 'string',
              description: 'Market code',
            },
          },
        },
        outputContract: {
          mode: 'sync_result',
          resultFormat: 'markdown',
          structuredPayload: 'none',
        },
      },
    });

    expect(output).toContain('- Status: setup required');
    expect(output).toContain('- Can Run Now: No');
    expect(output).toContain('- Next Step: Complete connector setup in Settings → Connectors, then retry.');
    expect(output).not.toContain('- Install:');
    expect(output).not.toContain('- Runtime:');
    expect(output).toContain('## CLI Usage');
    expect(output).toContain('vernclaw-cli invoke seo.website-traffic --domain example.com');
    expect(output).toContain('--domain (required)');
    expect(output).toContain('--market (optional)');
  });

  it('renders login required summary in describe output for unauthenticated users', async () => {
    const { renderCatalogDescribe } = await import('../src/catalog/render.js');

    const output = renderCatalogDescribe({
      id: 'seo.website-traffic',
      name: 'Website Traffic Get',
      category: 'seo',
      description: 'Traffic lookup',
      version: '1.0.0',
      minCliVersion: '0.1.0',
      visibility: 'visible',
      compatibilityState: 'supported',
      installStatus: 'available',
      runtimeStatus: 'unknown',
      authStatus: 'unknown',
      trainingStatus: 'unknown',
      source: 'remote',
      manifest: {
        id: 'seo.website-traffic',
        name: 'Website Traffic Get',
        category: 'seo',
        description: 'Traffic lookup',
        version: '1.0.0',
        connectorType: 'read_only',
        minCliVersion: '0.1.0',
        requiredCliFeatures: ['registry_v1'],
        inputSchema: {
          domain: 'string',
        },
        outputContract: {
          mode: 'sync_result',
          resultFormat: 'markdown',
          structuredPayload: 'none',
        },
      },
    }, { viewerState: 'unauthenticated' });

    expect(output).toContain('- Status: login required');
    expect(output).toContain('- Can Run Now: No');
    expect(output).toContain('- Next Step: Run `vernclaw-cli login` and retry.');
  });

  it('supports legacy input schema maps when rendering describe output', async () => {
    const { renderCatalogDescribe } = await import('../src/catalog/render.js');

    const output = renderCatalogDescribe({
      id: 'seo.website-traffic',
      name: 'Website Traffic Get',
      category: 'seo',
      description: 'Traffic lookup',
      version: '1.0.0',
      minCliVersion: '0.1.0',
      visibility: 'visible',
      compatibilityState: 'supported',
      installStatus: 'available',
      runtimeStatus: 'unknown',
      authStatus: 'unknown',
      trainingStatus: 'unknown',
      source: 'remote',
      manifest: {
        id: 'seo.website-traffic',
        name: 'Website Traffic Get',
        category: 'seo',
        description: 'Traffic lookup',
        version: '1.0.0',
        connectorType: 'read_only',
        minCliVersion: '0.1.0',
        requiredCliFeatures: ['registry_v1'],
        inputSchema: {
          domain: 'string',
          market: 'string?',
        },
        outputContract: {
          mode: 'sync_result',
          resultFormat: 'markdown',
          structuredPayload: 'none',
        },
      },
    });

    expect(output).toContain('vernclaw-cli invoke seo.website-traffic --domain example.com');
    expect(output).toContain('--domain (required)');
    expect(output).toContain('--market (optional)');
  });
});
