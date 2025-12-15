import type { NextRequest } from 'next/server';
import { randomUUID } from 'node:crypto';

import { CORS_HEADERS, applyCorsHeaders, createOptionsResponse } from './cors';
import {
  processRpcPayload,
  toJsonRpcError,
  type JsonRpcRequest,
  type JsonRpcResponse
} from './rpc';
import { registerSession, removeSession } from './sessionStore';

export const runtime = 'nodejs';

const encoder = new TextEncoder();

const SSE_HEADERS = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache, no-transform',
  Connection: 'keep-alive',
  ...CORS_HEADERS
};

function isSseRequest(request: NextRequest) {
  const accept = request.headers.get('accept');
  return accept?.includes('text/event-stream');
}

function writeEvent(
  controller: ReadableStreamDefaultController<Uint8Array>,
  event: string,
  data: string
) {
  controller.enqueue(encoder.encode(`event: ${event}\ndata: ${data}\n\n`));
}

export async function GET(request: NextRequest) {
  if (!isSseRequest(request)) {
    return new Response('CE.SDK MCP endpoint', {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }

  const sessionId = randomUUID();
  let closed = false;
  let heartbeat: NodeJS.Timeout | undefined;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (message: JsonRpcResponse | JsonRpcResponse[]) => {
        if (closed) {
          return;
        }
        const payload = JSON.stringify(message);
        writeEvent(controller, 'message', payload);
      };

      registerSession(sessionId, { send });

      writeEvent(
        controller,
        'endpoint',
        `/mcp/messages?sessionId=${sessionId}`
      );

      heartbeat = setInterval(() => {
        if (closed) {
          return;
        }
        controller.enqueue(encoder.encode(': keep-alive\n\n'));
      }, 15000);
    },
    cancel() {
      if (heartbeat) {
        clearInterval(heartbeat);
      }
      closed = true;
      removeSession(sessionId);
    }
  });

  return new Response(stream, {
    status: 200,
    headers: SSE_HEADERS
  });
}

export async function POST(request: NextRequest) {
  let payload: JsonRpcRequest | JsonRpcRequest[];
  try {
    payload = (await request.json()) as JsonRpcRequest | JsonRpcRequest[];
  } catch (error) {
    console.error('[MCP] JSON parse error', error);
    const response = new Response(
      JSON.stringify(toJsonRpcError(null, -32700, 'Parse error')),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    return applyCorsHeaders(response);
  }

  const origin = request.nextUrl.origin;
  const result = await processRpcPayload(payload, origin);
  const response = new Response(JSON.stringify(result), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
  return applyCorsHeaders(response);
}

export async function OPTIONS() {
  return createOptionsResponse();
}
