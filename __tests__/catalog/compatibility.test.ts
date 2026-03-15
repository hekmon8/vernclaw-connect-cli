import { describe, expect, it } from 'vitest';

import { evaluateConnectorCompatibility } from '../../src/catalog/compatibility.js';
import type { RegistryCatalogEntry } from '../../src/catalog/types.js';

function buildEntry(
  overrides: Partial<RegistryCatalogEntry['manifest']> = {},
  overlayOverrides: Partial<RegistryCatalogEntry['overlay']> = {}
): RegistryCatalogEntry {
  return {
    manifest: {
      id: 'seo.website-traffic',
      name: 'SEO Website Traffic',
      version: '1.0.0',
      connector_type: 'read_only',
      min_cli_version: '0.1.0',
      required_cli_features: ['registry_v1', 'invoke_v1'],
      input_schema: {
        type: 'object',
        required: ['domain'],
        properties: {
          domain: {
            type: 'string',
            description: 'Target domain',
          },
        },
      },
      output_contract: {
        mode: 'sync_result',
        result_format: 'markdown',
        structured_payload: 'none',
      },
      ...overrides,
    },
    overlay: {
      visible: true,
      featured: false,
      emergency_disable: false,
      ...overlayOverrides,
    },
  };
}

describe('catalog compatibility', () => {
  it('marks connectors supported when schema, version, and features match', () => {
    const result = evaluateConnectorCompatibility({
      registrySchema: '1.3',
      supportedRegistrySchemas: ['1.3'],
      cliVersion: '0.1.0',
      cliFeatures: ['registry_v1', 'invoke_v1'],
      entry: buildEntry(),
    });

    expect(result.compatibilityState).toBe('supported');
    expect(result.installStatus).toBe('installable');
  });

  it('surfaces visible upgrade required when min cli version is higher', () => {
    const result = evaluateConnectorCompatibility({
      registrySchema: '1.3',
      supportedRegistrySchemas: ['1.3'],
      cliVersion: '0.1.0',
      cliFeatures: ['registry_v1', 'invoke_v1'],
      entry: buildEntry({
        min_cli_version: '0.2.0',
      }),
    });

    expect(result.compatibilityState).toBe('visible_upgrade_required');
    expect(result.installStatus).toBe('upgrade_required');
    expect(result.compatibilityReasons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'CLI_UPGRADE_REQUIRED',
        }),
      ])
    );
  });

  it('marks unsupported when registry schema is not recognized', () => {
    const result = evaluateConnectorCompatibility({
      registrySchema: '2.0',
      supportedRegistrySchemas: ['1.3'],
      cliVersion: '0.1.0',
      cliFeatures: ['registry_v1', 'invoke_v1'],
      entry: buildEntry(),
    });

    expect(result.compatibilityState).toBe('unsupported');
    expect(result.compatibilityReasons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'REGISTRY_SCHEMA_UNSUPPORTED',
        }),
      ])
    );
  });

  it('hides connectors that are not visible in overlay', () => {
    const result = evaluateConnectorCompatibility({
      registrySchema: '1.3',
      supportedRegistrySchemas: ['1.3'],
      cliVersion: '0.1.0',
      cliFeatures: ['registry_v1', 'invoke_v1'],
      entry: buildEntry({}, { visible: false }),
    });

    expect(result.compatibilityState).toBe('hidden');
    expect(result.visibility).toBe('hidden');
  });
});
