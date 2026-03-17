function compareVersions(left, right) {
    const leftParts = left.split('.').map((part) => Number.parseInt(part, 10) || 0);
    const rightParts = right.split('.').map((part) => Number.parseInt(part, 10) || 0);
    const maxLength = Math.max(leftParts.length, rightParts.length);
    for (let index = 0; index < maxLength; index += 1) {
        const leftValue = leftParts[index] || 0;
        const rightValue = rightParts[index] || 0;
        if (leftValue === rightValue)
            continue;
        return leftValue < rightValue ? -1 : 1;
    }
    return 0;
}
function resolveCompatibility({ cliVersion, supportedRegistrySchemas, supportedFeatures, registrySchema, minCliVersion, requiredCliFeatures, visible, emergencyDisable, }) {
    if (emergencyDisable) {
        return {
            state: 'disabled',
            reasons: [
                {
                    code: 'CONNECTOR_DISABLED',
                    message: 'Connector disabled by registry overlay.',
                },
            ],
        };
    }
    if (!visible) {
        return {
            state: 'hidden',
            reasons: [
                {
                    code: 'CONNECTOR_HIDDEN',
                    message: 'Connector hidden by registry overlay.',
                },
            ],
        };
    }
    if (!supportedRegistrySchemas.includes(registrySchema)) {
        return {
            state: 'unsupported',
            reasons: [
                {
                    code: 'REGISTRY_SCHEMA_UNSUPPORTED',
                    message: `Unsupported registry schema ${registrySchema}.`,
                },
            ],
        };
    }
    const missingFeatures = requiredCliFeatures.filter((feature) => !supportedFeatures.includes(feature));
    if (missingFeatures.length > 0) {
        return {
            state: 'visible_upgrade_required',
            reasons: [
                {
                    code: 'REQUIRED_CLI_FEATURE_MISSING',
                    message: `Missing CLI features: ${missingFeatures.join(', ')}.`,
                },
            ],
        };
    }
    if (compareVersions(cliVersion, minCliVersion) < 0) {
        return {
            state: 'visible_upgrade_required',
            reasons: [
                {
                    code: 'CLI_UPGRADE_REQUIRED',
                    message: `Requires vernclaw-cli >= ${minCliVersion}`,
                },
            ],
        };
    }
    return {
        state: 'supported',
        reasons: [],
    };
}
export function evaluateConnectorCompatibility({ registrySchema, supportedRegistrySchemas, cliVersion, cliFeatures, entry, }) {
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
        visibility: compatibility.state === 'hidden'
            ? 'hidden'
            : compatibility.state === 'disabled'
                ? 'disabled'
                : 'visible',
        compatibilityState: compatibility.state,
        installStatus: compatibility.state === 'supported'
            ? 'installable'
            : compatibility.state === 'visible_upgrade_required'
                ? 'upgrade_required'
                : 'unavailable',
        compatibilityReasons: compatibility.reasons,
    };
}
function resolveInstallStatus(compatibilityState, runtimeState) {
    if (compatibilityState === 'disabled')
        return 'disabled';
    if (compatibilityState === 'hidden')
        return 'hidden';
    if (compatibilityState !== 'supported')
        return 'upgrade_required';
    if (!runtimeState)
        return 'available';
    return runtimeState.installed ? 'installed' : 'installable';
}
function resolveRuntimeStatus(compatibilityState, runtimeState) {
    if (compatibilityState !== 'supported') {
        return 'unavailable';
    }
    if (!runtimeState) {
        return 'unknown';
    }
    if (runtimeState.blockedByAdmin)
        return 'blocked';
    if (runtimeState.quotaExceeded)
        return 'quota_exceeded';
    if (runtimeState.authRequired)
        return 'auth_required';
    if (runtimeState.trainingRequired)
        return 'training_required';
    if (!runtimeState.installed)
        return 'not_installed';
    if (runtimeState.active)
        return 'active';
    return 'unknown';
}
function resolveAuthStatus(runtimeState) {
    if (!runtimeState)
        return 'unknown';
    return runtimeState.authRequired ? 'required' : 'not_required';
}
function resolveTrainingStatus(runtimeState) {
    if (!runtimeState)
        return 'unknown';
    if (runtimeState.trainingRequired)
        return 'required';
    if (runtimeState.installed)
        return 'acknowledged';
    return 'not_required';
}
export function buildEffectiveCatalog({ cliVersion, supportedRegistrySchemas, supportedFeatures, catalog, runtimeStates = [], source = 'remote', }) {
    const runtimeStateMap = new Map(runtimeStates.map((state) => [state.connectorId, state]));
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
            visibility: compatibility.state === 'disabled'
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
