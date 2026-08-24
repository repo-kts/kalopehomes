import 'dotenv/config';

/**
 * Centralised, validated environment configuration.
 * Fail fast at boot rather than deep inside a request handler.
 */
function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const nodeEnv = process.env.NODE_ENV ?? 'development';

export const env = {
  nodeEnv,
  isProduction: nodeEnv === 'production',
  isTest: nodeEnv === 'test',
  port: Number.parseInt(required('PORT', '4000'), 10),
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
} as const;

export type Env = typeof env;
