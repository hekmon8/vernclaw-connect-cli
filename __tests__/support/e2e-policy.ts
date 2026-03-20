type E2EPolicyInput = {
  apiBaseUrl: string;
  e2eRunEnv?: string;
  expectSuccessEnv?: string;
};

export type E2ETargetLabel = 'local' | 'production';

export type E2EPolicy = {
  targetLabel: E2ETargetLabel;
  shouldRunE2E: boolean;
  requireSuccess: boolean;
};

function resolveTargetLabel(apiBaseUrl: string): E2ETargetLabel {
  return apiBaseUrl.includes('127.0.0.1') || apiBaseUrl.includes('localhost')
    ? 'local'
    : 'production';
}

export function resolveE2EPolicy({
  apiBaseUrl,
  e2eRunEnv,
  expectSuccessEnv,
}: E2EPolicyInput): E2EPolicy {
  const targetLabel = resolveTargetLabel(apiBaseUrl);
  const shouldRunE2E = e2eRunEnv === '1';
  const requireSuccess =
    typeof expectSuccessEnv === 'string'
      ? expectSuccessEnv === '1'
      : targetLabel === 'production';

  return {
    targetLabel,
    shouldRunE2E,
    requireSuccess,
  };
}
