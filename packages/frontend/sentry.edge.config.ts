/**
 * Sentry Edge Configuration
 * This file configures Sentry for Edge runtime
 */
import * as Sentry from '@sentry/nextjs';

const sentryDsn = (typeof process !== 'undefined') 
  ? (process.env?.SENTRY_DSN || process.env?.NEXT_PUBLIC_SENTRY_DSN)
  : undefined;

const nodeEnv = (typeof process !== 'undefined' && process.env?.NODE_ENV) 
  ? process.env.NODE_ENV 
  : 'development';

Sentry.init({
  dsn: sentryDsn,
  environment: nodeEnv,
  tracesSampleRate: 0.1,
});

