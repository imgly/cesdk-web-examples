import type { NextRequest } from 'next/server';

import { applyCorsHeaders, createOptionsResponse } from '../cors';
import {
  processRpcPayload,
  toJsonRpcError,
  type JsonRpcRequest,
  type JsonRpcResponse
} from '../rpc';
import { getSession } from '../sessionStore';

export const runtime = 'nodejs';

function sendToSession(
  sessionId: string,
  message: JsonRpcResponse | JsonRpcResponse[]
) {
  const session = getSession(sessionId);
  if (!session) {
    return false;
  }
  session.send(message);
  return true;
}

export async function POST(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('sessionId');
  if (!sessionId) {
    return applyCorsHeaders(new Response('Missing sessionId', { status: 400 }));
  }

  if (!getSession(sessionId)) {
    return applyCorsHeaders(new Response('Unknown session', { status: 404 }));
  }

  let payload: JsonRpcRequest | JsonRpcRequest[];
  try {
    payload = (await request.json()) as JsonRpcRequest | JsonRpcRequest[];
  } catch (error) {
    console.error('[MCP] JSON parse error (messages)', error);
    sendToSession(sessionId, toJsonRpcError(null, -32700, 'Parse error'));
    return applyCorsHeaders(new Response(null, { status: 202 }));
  }

  const origin = request.nextUrl.origin;
  try {
    const result = await processRpcPayload(payload, origin);
    sendToSession(sessionId, result);
  } catch (error) {
    console.error('[MCP] Unexpected error handling message', error);
    sendToSession(
      sessionId,
      toJsonRpcError(
        null,
        -32603,
        error instanceof Error ? error.message : 'Unknown error'
      )
    );
  }

  return applyCorsHeaders(new Response(null, { status: 202 }));
}

export async function OPTIONS() {
  return createOptionsResponse();
}
