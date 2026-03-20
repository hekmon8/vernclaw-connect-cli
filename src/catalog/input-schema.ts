function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export interface NormalizedInputSchema {
  properties: Record<string, Record<string, unknown>>;
  required: string[];
}

export function normalizeInputSchema(
  inputSchema: Record<string, unknown> | undefined
): NormalizedInputSchema {
  const rawSchema = inputSchema || {};
  const schema = rawSchema as {
    properties?: Record<string, Record<string, unknown>>;
    required?: string[];
  };

  if (schema.properties && Object.keys(schema.properties).length > 0) {
    return {
      properties: schema.properties,
      required: Array.isArray(schema.required) ? schema.required : [],
    };
  }

  const legacyEntries = Object.entries(rawSchema).filter(
    ([key]) => key !== 'type' && key !== 'properties' && key !== 'required'
  );
  if (legacyEntries.length > 0) {
    const properties = Object.fromEntries(
      legacyEntries.map(([key, value]) => {
        const rawType = typeof value === 'string' ? value : 'string';
        const optional = rawType.endsWith('?');
        const normalizedType = optional ? rawType.slice(0, -1) : rawType;

        return [
          key,
          {
            type: normalizedType || 'string',
            description: `${key} parameter`,
          },
        ];
      })
    );
    const required = legacyEntries
      .filter(([, value]) => !(typeof value === 'string' && value.endsWith('?')))
      .map(([key]) => key);

    return {
      properties,
      required,
    };
  }

  return {
    properties: {},
    required: [],
  };
}

function isFiniteNumber(value: number) {
  return Number.isFinite(value);
}

function coerceBySchema(
  key: string,
  value: unknown,
  schema: Record<string, unknown>
):
  | { ok: true; value: unknown }
  | {
      ok: false;
      error: string;
    } {
  const type = typeof schema.type === 'string' ? schema.type : 'string';

  if (type === 'number' || type === 'integer') {
    const normalized =
      typeof value === 'number'
        ? value
        : typeof value === 'string' && value.trim()
          ? Number(value)
          : Number.NaN;

    if (!isFiniteNumber(normalized)) {
      return {
        ok: false,
        error: `Parameter \`${key}\` must be a valid ${type}.`,
      };
    }

    if (type === 'integer' && !Number.isInteger(normalized)) {
      return {
        ok: false,
        error: `Parameter \`${key}\` must be a valid integer.`,
      };
    }

    return { ok: true, value: normalized };
  }

  if (type === 'boolean') {
    if (typeof value === 'boolean') {
      return { ok: true, value };
    }

    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (normalized === 'true') {
        return { ok: true, value: true };
      }
      if (normalized === 'false') {
        return { ok: true, value: false };
      }
    }

    return {
      ok: false,
      error: `Parameter \`${key}\` must be a valid boolean.`,
    };
  }

  if (type === 'array') {
    if (Array.isArray(value)) {
      return { ok: true, value };
    }

    if (typeof value === 'string') {
      const normalized = value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
      return { ok: true, value: normalized };
    }

    return {
      ok: false,
      error: `Parameter \`${key}\` must be a valid array.`,
    };
  }

  if (type === 'object') {
    if (isRecord(value)) {
      return { ok: true, value };
    }

    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (isRecord(parsed)) {
          return { ok: true, value: parsed };
        }
      } catch {}
    }

    return {
      ok: false,
      error: `Parameter \`${key}\` must be a valid object.`,
    };
  }

  if (typeof value !== 'string') {
    return {
      ok: false,
      error: `Parameter \`${key}\` must be a valid string.`,
    };
  }

  const enumValues = Array.isArray(schema.enum) ? schema.enum : null;
  if (enumValues && enumValues.length > 0 && !enumValues.includes(value)) {
    return {
      ok: false,
      error: `Parameter \`${key}\` must be one of: ${enumValues
        .map((item) => String(item))
        .join(', ')}.`,
    };
  }

  return { ok: true, value };
}

export function validateAndNormalizeInvokePayload(
  payload: unknown,
  inputSchema: Record<string, unknown> | undefined
):
  | { ok: true; payload: Record<string, unknown> }
  | { ok: false; error: string } {
  if (!isRecord(payload)) {
    return {
      ok: false,
      error: 'Connector input must be a JSON object.',
    };
  }

  const { properties, required } = normalizeInputSchema(inputSchema);
  const normalizedPayload: Record<string, unknown> = { ...payload };

  for (const key of required) {
    if (!(key in payload)) {
      return {
        ok: false,
        error: `Missing required parameter: \`${key}\`.`,
      };
    }
  }

  for (const [key, schema] of Object.entries(properties)) {
    if (!(key in payload)) {
      continue;
    }

    const result = coerceBySchema(key, payload[key], schema);
    if (!result.ok) {
      return result;
    }

    normalizedPayload[key] = result.value;
  }

  return {
    ok: true,
    payload: normalizedPayload,
  };
}
