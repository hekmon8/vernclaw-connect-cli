function pad(value, width) {
    return value.length >= width ? value : value.padEnd(width, ' ');
}
export function renderCatalogTable(entries) {
    const columns = [
        ['CONNECTOR', 28],
        ['CATEGORY', 14],
        ['VISIBILITY', 12],
        ['INSTALL', 12],
        ['RUNTIME', 18],
        ['AUTH', 14],
        ['TRAINING', 14],
        ['MIN_CLI', 10],
        ['VERSION', 8],
    ];
    const header = columns
        .map(([label, width]) => pad(label, width))
        .join(' ');
    const body = entries
        .map((entry) => [
        pad(entry.id, 28),
        pad(entry.category, 14),
        pad(entry.visibility, 12),
        pad(entry.installStatus, 12),
        pad(entry.runtimeStatus, 18),
        pad(entry.authStatus, 14),
        pad(entry.trainingStatus, 14),
        pad(entry.minCliVersion, 10),
        pad(entry.version, 8),
    ].join(' '))
        .join('\n');
    return body ? `${header}\n${body}\n` : `${header}\n`;
}
export function renderCatalogDescribe(entry) {
    const inputFields = Object.entries(entry.manifest.inputSchema || {});
    return [
        `# ${entry.name}`,
        '',
        `- Connector ID: ${entry.id}`,
        `- Category: ${entry.category}`,
        `- Version: ${entry.version}`,
        `- Min CLI: ${entry.minCliVersion}`,
        `- Compatibility: ${entry.compatibilityState}`,
        `- Install: ${entry.installStatus}`,
        `- Runtime: ${entry.runtimeStatus}`,
        ...(entry.compatibilityReasons?.length
            ? [
                '',
                '## Compatibility Notes',
                '',
                ...entry.compatibilityReasons.map((item) => `- ${item.code}: ${item.message}`),
            ]
            : []),
        '',
        '## Summary',
        '',
        entry.description,
        '',
        '## Output Contract',
        '',
        `- Mode: ${entry.manifest.outputContract.mode}`,
        `- Result Format: ${entry.manifest.outputContract.resultFormat}`,
        `- Structured Payload: ${entry.manifest.outputContract.structuredPayload}`,
        '',
        '## Input Schema',
        '',
        ...(inputFields.length
            ? inputFields.map(([key, value]) => `- ${key}: ${JSON.stringify(value)}`)
            : ['- {}']),
        '',
    ].join('\n');
}
