/**
 * Sentry Client Configuration
 * This file configures Sentry for the client-side
 */
import * as Sentry from '@sentry/nextjs';

const sentryDsn = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SENTRY_DSN) 
  ? process.env.NEXT_PUBLIC_SENTRY_DSN 
  : undefined;

const nodeEnv = (typeof process !== 'undefined' && process.env?.NODE_ENV) 
  ? process.env.NODE_ENV 
  : 'development';

Sentry.init({
  dsn: sentryDsn,
  environment: nodeEnv,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.browserTracingIntegration(),
  ],
});

