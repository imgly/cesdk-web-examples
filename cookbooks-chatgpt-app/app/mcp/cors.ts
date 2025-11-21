export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, X-Requested-With'
} as const;

export function applyCorsHeaders(response: Response): Response {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export function createCorsResponse(
  body: BodyInit | null | undefined,
  init?: ResponseInit
): Response {
  const response = new Response(body, init);
  return applyCorsHeaders(response);
}

export function createOptionsResponse(): Response {
  return createCorsResponse(null, { status: 204 });
}
