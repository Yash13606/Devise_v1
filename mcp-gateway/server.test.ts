import assert from 'node:assert/strict';
import { test } from 'node:test';
import { randomUUID } from 'node:crypto';
import { buildGateway } from './server';

const rpc = { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'echo', arguments: { text: 'hello' } } };
const headers = { authorization: 'Bearer test-human-token', 'x-organization-id': randomUUID(),
  'x-request-id': randomUUID(), accept: 'application/json, text/event-stream' };

test('gateway forwards credentials only to trusted API and returns actual RPC result', async () => {
  let received: { url: string; options?: RequestInit } | undefined;
  const app = buildGateway({ apiUrl: 'http://127.0.0.1:8000', fetcher: async (url, options) => {
    received = { url: String(url), options };
    return new Response(JSON.stringify({ execution_id: randomUUID(), decision: 'allow', status: 'succeeded',
      policy_version: 1, result: { jsonrpc: '2.0', id: 1, result: { content: [{ type: 'text', text: 'hello' }] } } }));
  } });
  try {
    const response = await app.inject({ method: 'POST', url: '/mcp', headers, payload: rpc });
    assert.equal(response.statusCode, 200);
    assert.equal(response.json().result.content[0].text, 'hello');
    assert.equal(received?.url, 'http://127.0.0.1:8000/api/mcp/execute');
    assert.equal(new Headers(received?.options?.headers).get('Authorization'), headers.authorization);
    assert.equal(JSON.parse(String(received?.options?.body)).request_id, headers['x-request-id']);
    assert.equal((await app.inject({ url: '/ledger' })).statusCode, 404);
  } finally { await app.close(); }
});

test('missing identity, request id, wrong origin and rebinding never reach API', async () => {
  let calls = 0;
  const app = buildGateway({ apiUrl: 'http://127.0.0.1:8000', fetcher: async () => { calls++; return new Response('{}'); } });
  try {
    assert.equal((await app.inject({ method: 'POST', url: '/mcp', payload: rpc })).statusCode, 401);
    const { 'x-request-id': ignored, ...withoutRequest } = headers;
    assert.equal((await app.inject({ method: 'POST', url: '/mcp', headers: withoutRequest, payload: rpc })).statusCode, 400);
    assert.equal((await app.inject({ method: 'POST', url: '/mcp', headers: { ...headers, origin: 'https://evil.example' }, payload: rpc })).statusCode, 403);
    assert.equal((await app.inject({ method: 'POST', url: '/mcp', headers: { ...headers, host: 'evil.example' }, payload: rpc })).statusCode, 403);
    assert.equal(calls, 0);
    assert.equal((await app.inject({ url: '/mcp' })).statusCode, 405);
  } finally { await app.close(); }
});

test('blocked and pending decisions report no upstream execution', async () => {
  const app = buildGateway({ apiUrl: 'http://127.0.0.1:8000', fetcher: async () => new Response(JSON.stringify({
    execution_id: randomUUID(), decision: 'review', status: 'pending_review', policy_version: 2, review_id: randomUUID(),
  })) });
  try {
    const response = await app.inject({ method: 'POST', url: '/mcp', headers, payload: rpc });
    assert.equal(response.json().result.isError, true);
    assert.equal(response.json().result._meta.devise.status, 'pending_review');
    assert.match(response.json().result.content[0].text, /did not execute/);
    assert.equal(JSON.stringify(response.json()).includes('proxied'), false);
  } finally { await app.close(); }
});

test('API refusal, malformed replies and network errors never become successful proxying', async () => {
  for (const fetcher of [async () => new Response('{}', { status: 401 }), async () => new Response('not json'),
    async () => { throw new Error('network'); }]) {
    const app = buildGateway({ apiUrl: 'http://127.0.0.1:8000', fetcher });
    try {
      const response = await app.inject({ method: 'POST', url: '/mcp', headers, payload: rpc });
      assert.ok(response.statusCode >= 400);
      assert.equal(response.json().result, undefined);
    } finally { await app.close(); }
  }
  assert.throws(() => buildGateway({ apiUrl: 'http://remote.example' }), /HTTPS/);
  assert.throws(() => buildGateway({ apiUrl: 'https://user:secret@api.example' }), /origin/);
});
