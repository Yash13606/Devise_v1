/** Vercel Fastify entrypoint. The desktop/local launcher still uses server.ts. */
import { buildGateway } from './server';
import type { FastifyInstance } from 'fastify';

const app: FastifyInstance = buildGateway({
  apiUrl: 'http://127.0.0.1:8000',
  // This callback runs inside request handlers, never during the Vite build.
  // A missing binding fails closed instead of calling localhost in production.
  apiBinding: () => process.env.DEVISE_API_URL,
  routePrefix: '/gateway',
  publicHosts: [process.env.DEVISE_GATEWAY_PUBLIC_HOST, process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_BRANCH_URL, process.env.VERCEL_URL].filter((host): host is string => !!host),
  origins: process.env.CORS_ORIGINS?.split(',').map(item => item.trim()).filter(Boolean),
  logger: true,
});

const port = Number(process.env.PORT || 3001);
app.listen({ port, host: '0.0.0.0' }).catch(error => {
  app.log.error(error);
  process.exitCode = 1;
});
