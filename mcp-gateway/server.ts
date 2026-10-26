/** Thin MCP transport: Python owns authorization, policy, storage and execution. */
import fastify, { FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { randomUUID } from 'node:crypto';

type Fetcher = (url: string | URL, options?: RequestInit) => Promise<Response>;
type Options = { apiUrl: string; origins?: string[]; publicHost?: string; fetcher?: Fetcher; logger?: boolean };
type Execution = { execution_id: string; decision: string; status: string; policy_version: number; result?: Record<string, unknown> };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const LOCAL = new Set(['127.0.0.1', 'localhost', '[::1]']);
const object = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

function origin(value: string): string {
  const url = new URL(value);
  if (url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error('API URL must be an origin without credentials, path or query');
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && LOCAL.has(url.hostname))) throw new Error('API URL requires HTTPS away from loopback');
  return url.origin;
}

function identity(request: FastifyRequest) {
  const auth = request.headers.authorization;
  const org = request.headers['x-organization-id'];
  if (!auth?.startsWith('Bearer ') || auth.length > 8192 || typeof org !== 'string' || !UUID.test(org)) return null;
  return { Authorization: auth, 'X-Organization-ID': org, 'Content-Type': 'application/json' };
}

async function readJson(response: Response): Promise<unknown> {
  if (!response.body) throw new Error('Empty trusted API response');
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 512 * 1024) throw new Error('Trusted API response too large');
      chunks.push(value);
    }
  } finally { await reader.cancel(); }
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown;
}

const execution = (value: unknown): value is Execution => object(value) && typeof value.execution_id === 'string'
  && typeof value.status === 'string' && typeof value.decision === 'string' && typeof value.policy_version === 'number';

export function buildGateway(options: Options) {
  const api = origin(options.apiUrl);
  const fetcher: Fetcher = options.fetcher ?? fetch;
  const origins = options.origins ?? ['http://127.0.0.1:8081', 'http://localhost:8081'];
  for (const item of origins) if (origin(item) !== item) throw new Error('CORS origins must be exact');
  const hosts = new Set([...LOCAL, ...(options.publicHost ? [options.publicHost] : [])]);
  const app = fastify({ bodyLimit: 512 * 1024, logger: options.logger ? {
    level: 'info', redact: ['req.headers.authorization', 'req.headers.cookie', 'res.headers.set-cookie'],
  } : false });
  app.register(cors, { origin: origins, methods: ['POST', 'GET'], allowedHeaders: ['Authorization', 'Content-Type', 'X-Organization-ID', 'X-Request-ID', 'MCP-Protocol-Version'] });
  app.register(rateLimit, { max: 100, timeWindow: '1 minute' });
  app.addHook('onRequest', async (request, reply) => {
    let host: string;
    try { host = new URL('http://' + request.headers.host).hostname; }
    catch { return reply.code(403).send({ detail: 'Invalid gateway host' }); }
    if (!hosts.has(host) || (request.headers.origin && !origins.includes(request.headers.origin))) return reply.code(403).send({ detail: 'Gateway host/origin is not allowed' });
  });
  app.addHook('onSend', async (_request, reply) => { reply.header('Cache-Control', 'no-store'); });

  app.get('/health', async (_request, reply) => {
    try {
      const response = await fetcher(api + '/health', { signal: AbortSignal.timeout(4000), redirect: 'manual' });
      if (!response.ok) return reply.code(503).send({ status: 'unavailable', api_status: response.status });
      return { status: 'ok', api: 'reachable', capability: 'stateless-json-http', upstream_verified: false };
    } catch { return reply.code(503).send({ status: 'unavailable' }); }
  });
  app.get('/mcp', async (_request, reply) => reply.code(405).header('Allow', 'POST').send({ detail: 'Server-initiated SSE is unavailable' }));

  app.post('/mcp', async (request, reply) => {
    const auth = identity(request);
    if (!auth) return reply.code(401).send({ detail: 'Human bearer credential and organization UUID required' });
    const body = request.body;
    if (!object(body) || body.jsonrpc !== '2.0' || typeof body.method !== 'string') return reply.code(400).send({ detail: 'A single JSON-RPC 2.0 object is required' });
    const id = request.headers['x-request-id'];
    if (body.method === 'tools/call' && (typeof id !== 'string' || !UUID.test(id))) return reply.code(400).send({ detail: 'tools/call requires a stable UUID X-Request-ID; reuse only for identical retries' });
    const accept = request.headers.accept ?? '';
    if (!accept.includes('application/json') || !accept.includes('text/event-stream')) return reply.code(406).send({ detail: 'Accept application/json and text/event-stream is required' });
    try {
      const response = await fetcher(api + '/api/mcp/execute', { method: 'POST', headers: auth,
        body: JSON.stringify({ request_id: typeof id === 'string' && UUID.test(id) ? id : randomUUID(), rpc: body }),
        redirect: 'manual', signal: AbortSignal.timeout(15000) });
      if (!response.ok) return reply.code(response.status >= 400 && response.status < 500 ? response.status : 502).send({
        jsonrpc: '2.0', id: body.id ?? null, error: { code: -32001, message: 'Trusted API refused the request', data: { status: response.status } },
      });
      const value = await readJson(response);
      if (!execution(value)) throw new Error('Invalid execution response');
      if (body.method === 'notifications/initialized' && body.id === undefined && value.status === 'succeeded') return reply.code(202).send();
      if (value.status === 'succeeded' && object(value.result) && !('notification_accepted' in value.result)) return value.result;
      return { jsonrpc: '2.0', id: body.id ?? null, result: { isError: true,
        content: [{ type: 'text', text: `Devise decision: ${value.decision}; status: ${value.status}. This does not confirm upstream execution. Pending or blocked requests did not execute. Review or explicitly continue warnings in Devise.` }],
        _meta: { devise: value } } };
    } catch { return reply.code(502).send({ jsonrpc: '2.0', id: body.id ?? null,
      error: { code: -32002, message: 'Trusted API result unavailable. Execution may be uncertain; retry only with the identical X-Request-ID.' } }); }
  });

  app.post('/mcp/continue', async (request, reply) => {
    const auth = identity(request);
    if (!auth) return reply.code(401).send({ detail: 'Human bearer credential and organization UUID required' });
    const body = request.body;
    if (!object(body) || Object.keys(body).length !== 1 || typeof body.continuation_token !== 'string') return reply.code(400).send({ detail: 'An explicit warning continuation token is required' });
    try {
      const response = await fetcher(api + '/api/mcp/continue', { method: 'POST', headers: auth,
        body: JSON.stringify(body), redirect: 'manual', signal: AbortSignal.timeout(15000) });
      if (!response.ok) return reply.code(response.status >= 400 && response.status < 500 ? response.status : 502).send({ detail: 'Warning continuation refused' });
      const value = await readJson(response);
      if (!execution(value)) throw new Error('Invalid execution response');
      return value;
    } catch { return reply.code(502).send({ detail: 'Continuation result unavailable; do not start a new request automatically' }); }
  });
  return app;
}

if (require.main === module) {
  const host = process.env.DEVISE_GATEWAY_BIND || '127.0.0.1';
  const port = Number(process.env.PORT || process.env.FASTIFY_PORT || 3001);
  if (host !== '127.0.0.1' && !(process.env.APP_ENV === 'production' && process.env.DEVISE_GATEWAY_PUBLIC_HOST)) throw new Error('Non-loopback binding requires production and an explicit public host');
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid gateway port');
  const app = buildGateway({ apiUrl: process.env.DEVISE_API_URL || 'http://127.0.0.1:8000', publicHost: process.env.DEVISE_GATEWAY_PUBLIC_HOST,
    origins: process.env.CORS_ORIGINS?.split(',').map(item => item.trim()).filter(Boolean), logger: true });
  app.listen({ port, host }).catch(error => { app.log.error(error); process.exitCode = 1; });
  process.once('SIGINT', () => { void app.close(); });
  process.once('SIGTERM', () => { void app.close(); });
}
