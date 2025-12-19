import type { JsonRpcResponse } from './rpc';

type Session = {
  send: (message: JsonRpcResponse | JsonRpcResponse[]) => void;
};

const GLOBAL_KEY = Symbol.for('cesdk.mcp.sessions');

function getStore(): Map<string, Session> {
  const globalAny = globalThis as unknown as Record<string | symbol, unknown>;
  if (!globalAny[GLOBAL_KEY]) {
    globalAny[GLOBAL_KEY] = new Map<string, Session>();
  }
  return globalAny[GLOBAL_KEY] as Map<string, Session>;
}

export function registerSession(sessionId: string, session: Session) {
  getStore().set(sessionId, session);
}

export function getSession(sessionId: string) {
  return getStore().get(sessionId);
}

export function removeSession(sessionId: string) {
  getStore().delete(sessionId);
}
