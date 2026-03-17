import type {
  CatalogBuildOptions,
  CompatibilityReason,
  ConnectorRuntimeState,
  EffectiveConnectorView,
  RegistryCatalogEntry,
} from './types.js';

function compareVersions(left: string, right: string) {
  const leftParts = left.split('.').map((part) => Number.parseInt(part, 10) || 0);
  const rightParts = right.split('.').map((part) => Number.parseInt(part, 10) || 0);
  const maxLength = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < maxLength; index += 1) {
    const leftValue = leftParts[index] || 0;
    const rightValue = rightParts[index] || 0;

    if (leftValue === rightValue) continue;
    return leftValue < rightValue ? -1 : 1;
  }

  return 0;
}

function resolveCompatibility({
  cliVersion,
  supportedRegistrySchemas,
  supportedFeatures,
  registrySchema,
  minCliVersion,
  requiredCliFeatures,
  visible,
  emergencyDisable,
}: {
  cliVersion: string;
  supportedRegistrySchemas: string[];
  supportedFeatures: string[];
  registrySchema: string;
  minCliVersion: string;
  requiredCliFeatures: string[];
  visible: boolean;
  emergencyDisable: boolean;
}) {
  if (emergencyDisable) {
    return {
      state: 'disabled' as const,
      reasons: [
        {
          code: 'CONNECTOR_DISABLED',
          message: 'Connector disabled by registry overlay.',
        },
      ] satisfies CompatibilityReason[],
    };
  }

  if (!visible) {
    return {
      state: 'hidden' as const,
      reasons: [
        {
          code: 'CONNECTOR_HIDDEN',
          message: 'Connector hidden by registry overlay.',
        },
      ] satisfies CompatibilityReason[],
    };
  }

  if (!supportedRegistrySchemas.includes(registrySchema)) {
    return {
      state: 'unsupported' as const,
      reasons: [
        {
          code: 'REGISTRY_SCHEMA_UNSUPPORTED',
          message: `Unsupported registry schema ${registrySchema}.`,
        },
      ] satisfies CompatibilityReason[],
    };
  }

  const missingFeatures = requiredCliFeatures.filter(
    (feature) => !supportedFeatures.includes(feature)
  );
  if (missingFeatures.length > 0) {
    return {
      state: 'visible_upgrade_required' as const,
      reasons: [
        {
          code: 'REQUIRED_CLI_FEATURE_MISSING',
          message: `Missing CLI features: ${missingFeatures.join(', ')}.`,
        },
      ] satisfies CompatibilityReason[],
    };
  }

  if (compareVersions(cliVersion, minCliVersion) < 0) {
    return {
      state: 'visible_upgrade_required' as const,
      reasons: [
        {
          code: 'CLI_UPGRADE_REQUIRED',
          message: `Requires vernclaw-cli >= ${minCliVersion}`,
        },
      ] satisfies CompatibilityReason[],
    };
  }

  return {
    state: 'supported' as const,
    reasons: [] as CompatibilityReason[],
  };
}

export function evaluateConnectorCompatibility({
  registrySchema,
  supportedRegistrySchemas,
  cliVersion,
  cliFeatures,
  entry,
}: {
  registrySchema: string;
  supportedRegistrySchemas: string[];
  cliVersion: string;
  cliFeatures: string[];
  entry: RegistryCatalogEntry;
}) {
  const compatibility = resolveCompatibility({
    cliVersion,
    supportedRegistrySchemas,
    supportedFeatures: cliFeatures,
    registrySchema,
    minCliVersion: entry.manifest.min_cli_version,
    requiredCliFeatures: entry.manifest.required_cli_features,
    visible: entry.overlay.visible,
    emergencyDisable: entry.overlay.emergency_disable,
  });

  return {
    visibility:
      compatibility.state === 'hidden'
        ? 'hidden'
        : compatibility.state === 'disabled'
          ? 'disabled'
          : 'visible',
    compatibilityState: compatibility.state,
    installStatus:
      compatibility.state === 'supported'
        ? ('installable' as const)
        : compatibility.state === 'visible_upgrade_required'
          ? ('upgrade_required' as const)
          : ('unavailable' as const),
    compatibilityReasons: compatibility.reasons,
  };
}

function resolveInstallStatus(
  compatibilityState: EffectiveConnectorView['compatibilityState'],
  runtimeState?: ConnectorRuntimeState
): EffectiveConnectorView['installStatus'] {
  if (compatibilityState === 'disabled') return 'disabled';
  if (compatibilityState === 'hidden') return 'hidden';
  if (compatibilityState !== 'supported') return 'upgrade_required';
  if (!runtimeState) return 'available';
  return runtimeState.installed ? 'installed' : 'installable';
}

function resolveRuntimeStatus(
  compatibilityState: EffectiveConnectorView['compatibilityState'],
  runtimeState?: ConnectorRuntimeState
): EffectiveConnectorView['runtimeStatus'] {
  if (compatibilityState !== 'supported') {
    return 'unavailable';
  }

  if (!runtimeState) {
    return 'unknown';
  }

  if (runtimeState.blockedByAdmin) return 'blocked';
  if (runtimeState.quotaExceeded) return 'quota_exceeded';
  if (runtimeState.authRequired) return 'auth_required';
  if (runtimeState.trainingRequired) return 'training_required';
  if (!runtimeState.installed) return 'not_installed';
  if (runtimeState.active) return 'active';
  return 'unknown';
}

function resolveAuthStatus(
  runtimeState?: ConnectorRuntimeState
): EffectiveConnectorView['authStatus'] {
  if (!runtimeState) return 'unknown';
  return runtimeState.authRequired ? 'required' : 'not_required';
}

function resolveTrainingStatus(
  runtimeState?: ConnectorRuntimeState
): EffectiveConnectorView['trainingStatus'] {
  if (!runtimeState) return 'unknown';
  if (runtimeState.trainingRequired) return 'required';
  if (runtimeState.installed) return 'acknowledged';
  return 'not_required';
}

export function buildEffectiveCatalog({
  cliVersion,
  supportedRegistrySchemas,
  supportedFeatures,
  catalog,
  runtimeStates = [],
  source = 'remote',
}: CatalogBuildOptions): EffectiveConnectorView[] {
  const runtimeStateMap = new Map(
    runtimeStates.map((state) => [state.connectorId, state])
  );

  return catalog.connectors.map(({ manifest, overlay }) => {
    const compatibility = resolveCompatibility({
      cliVersion,
      supportedRegistrySchemas,
      supportedFeatures,
      registrySchema: catalog.registrySchema,
      minCliVersion: manifest.minCliVersion,
      requiredCliFeatures: manifest.requiredCliFeatures,
      visible: overlay.visible,
      emergencyDisable: overlay.emergencyDisable,
    });
    const runtimeState = runtimeStateMap.get(manifest.id);

    return {
      id: manifest.id,
      name: manifest.name,
      category: manifest.category,
      description: manifest.description,
      version: manifest.version,
      minCliVersion: manifest.minCliVersion,
      visibility:
        compatibility.state === 'disabled'
          ? 'disabled'
          : overlay.visible
            ? 'visible'
            : 'hidden',
      compatibilityState: compatibility.state,
      installStatus: resolveInstallStatus(compatibility.state, runtimeState),
      runtimeStatus: resolveRuntimeStatus(compatibility.state, runtimeState),
      authStatus: resolveAuthStatus(runtimeState),
      trainingStatus: resolveTrainingStatus(runtimeState),
      compatibilityReasons: compatibility.reasons,
      source,
      manifest,
    };
  });
}
