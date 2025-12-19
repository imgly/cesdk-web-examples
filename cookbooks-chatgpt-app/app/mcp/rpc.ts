import { randomUUID } from 'node:crypto';
import { z } from 'zod';

import { baseURL } from '@/baseUrl';
import type { TemplateDefinition } from '@/templates/catalog';
import { getTemplateById, getTemplatesByLayout } from '@/templates/catalog';

export const JSONRPC_VERSION = '2.0';
const PROTOCOL_VERSION = '2025-06-18';
const SUPPORTED_PROTOCOL_VERSIONS = new Set([
  '2025-06-18',
  '2024-11-05',
  '2024-08-05',
  '2024-06-01',
  '1.0'
]);
const SERVER_INFO = { name: 'cesdk-chatgpt-app', version: '1.0.0' } as const;
const CAPABILITIES = {
  tools: { listChanged: false },
  resources: { listChanged: false }
} as const;

const METHOD_ALIASES = new Map<string, string>([
  ['tools/list', 'tools.list'],
  ['tools/call', 'tools.call'],
  ['resources/list', 'resources.list'],
  ['resources/get', 'resources.get'],
  ['resources/read', 'resources.read'],
  ['resources/templates/list', 'resources.templates.list'],
  ['notifications/initialised', 'notifications/initialized']
]);

const LIST_TEMPLATES_INPUT = z.object({
  layoutType: z.string().min(1),
  limit: z.number().int().min(1).max(8).optional()
});

const LOAD_TEMPLATE_INPUT = z.object({
  templateId: z.string().min(1),
  placeholderValues: z.record(z.string()).optional(),
  layoutType: z.string().optional()
});

type ListTemplatesArgs = z.infer<typeof LIST_TEMPLATES_INPUT>;
type LoadTemplateArgs = z.infer<typeof LOAD_TEMPLATE_INPUT>;

export type JsonRpcRequest = {
  jsonrpc: string;
  id: string | number | null;
  method: string;
  params?: unknown;
};

export type JsonRpcResponse = {
  jsonrpc: string;
  id: string | number | null;
  result?: unknown;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
};

const TEMPLATE_EDITOR_WIDGET = {
  id: 'template-editor',
  title: 'CE.SDK Editor',
  templateUri: 'ui://widget/template-editor.html',
  description: 'Opens the CE.SDK Editor with the selected template.',
  invoking: 'Initializing CE.SDK…',
  invoked: 'CE.SDK Editor ready'
} as const;

const WIDGET_META = {
  'openai/outputTemplate': TEMPLATE_EDITOR_WIDGET.templateUri,
  'openai/toolInvocation/invoking': TEMPLATE_EDITOR_WIDGET.invoking,
  'openai/toolInvocation/invoked': TEMPLATE_EDITOR_WIDGET.invoked,
  'openai/widgetAccessible': true,
  'openai/resultCanProduceWidget': true
} as const;

const LIST_TEMPLATES_SCHEMA = {
  type: 'object',
  required: ['layoutType'],
  additionalProperties: false,
  properties: {
    layoutType: {
      type: 'string',
      description:
        'Layout type such as "birthday_card", "e-commerce", or "socials".'
    },
    limit: {
      type: 'integer',
      minimum: 1,
      maximum: 8,
      description: 'Maximum number of suggestions (default: 4).'
    }
  }
} as const;

const LOAD_TEMPLATE_SCHEMA = {
  type: 'object',
  required: ['templateId'],
  additionalProperties: false,
  properties: {
    templateId: {
      type: 'string',
      description: 'Template identifier from the template gallery.'
    },
    placeholderValues: {
      type: 'object',
      additionalProperties: {
        type: 'string'
      },
      description: 'Placeholder values, for example { "headline": "Happy Birthday" }.'
    },
    layoutType: {
      type: 'string',
      description: 'Optional layout type hint provided by the caller.'
    }
  }
} as const;

const TOOLS = [
  {
    name: 'list_templates',
    title: 'Template Gallery',
    description:
      'Lists available CE.SDK templates for a layout type and provides clickable suggestions.',
    inputSchema: LIST_TEMPLATES_SCHEMA,
    annotations: {
      destructiveHint: false,
      openWorldHint: false,
      readOnlyHint: true
    }
  },
  {
    name: 'load_template',
    title: 'Template Editor',
    description:
      'Loads a selected template into the CE.SDK Editor and applies placeholder values.',
    inputSchema: LOAD_TEMPLATE_SCHEMA,
    annotations: {
      destructiveHint: false,
      openWorldHint: false,
      readOnlyHint: true
    },
    _meta: WIDGET_META
  }
] as const;

const RESOURCES = [
  {
    uri: TEMPLATE_EDITOR_WIDGET.templateUri,
    name: TEMPLATE_EDITOR_WIDGET.title,
    description: TEMPLATE_EDITOR_WIDGET.description,
    mimeType: 'text/html+skybridge',
    _meta: WIDGET_META
  }
] as const;

const RESOURCE_TEMPLATES = [
  {
    uriTemplate: TEMPLATE_EDITOR_WIDGET.templateUri,
    name: TEMPLATE_EDITOR_WIDGET.title,
    description: TEMPLATE_EDITOR_WIDGET.description,
    mimeType: 'text/html+skybridge',
    _meta: WIDGET_META
  }
] as const;

const getAppsSdkCompatibleHtml = async (baseUrl: string, path: string) => {
  const result = await fetch(`${baseUrl}${path}`);
  if (!result.ok) {
    throw new Error(
      `Failed to fetch HTML from ${baseUrl}${path}: ${result.status}`
    );
  }
  return result.text();
};

async function getWidgetHtml(origin: string) {
  const html = await getAppsSdkCompatibleHtml(baseURL ?? origin, '/');
  const script = `\n<script>\n(function(){\n  document.body.dataset.cesdkWidgetId = ${JSON.stringify(
    TEMPLATE_EDITOR_WIDGET.id
  )};\n})();\n</script>\n`;
  if (html.includes('</body>')) {
    return html.replace('</body>', `${script}</body>`);
  }
  return `${html}${script}`;
}

function mapTemplate(template: TemplateDefinition) {
  return {
    id: template.id,
    title: template.title,
    description: template.description,
    sceneUrl: template.sceneUrl,
    previewUrl: template.previewUrl ?? null,
    layoutType: template.layoutType,
    tags: template.tags ?? []
  };
}

function formatTemplateList(
  templates: TemplateDefinition[],
  layoutType: string
) {
  if (!templates.length) {
    return `No templates found for "${layoutType}".`;
  }
  const lines = templates.map((template, index) => {
    const tags = template.tags?.length ? ` (${template.tags.join(', ')})` : '';
    return `${index + 1}. ${template.title}${tags} – ${template.sceneUrl}`;
  });
  return ['Found templates:', ...lines].join('\n');
}

async function listTemplates(origin: string, args: ListTemplatesArgs) {
  const { layoutType, limit } = args;
  const templates = getTemplatesByLayout(layoutType, limit ?? 4);
  const mapped = templates.map(mapTemplate);
  const text = formatTemplateList(templates, layoutType);
  return {
    content: [{ type: 'text', text }],
    structuredContent: {
      mode: 'template_gallery',
      layoutType,
      templates: mapped,
      timestamp: new Date().toISOString(),
      widgetId: null
    }
  };
}

async function loadTemplate(origin: string, args: LoadTemplateArgs) {
  const template = getTemplateById(args.templateId);
  if (!template) {
    throw new Error(`Template "${args.templateId}" not found.`);
  }

  const html = await getWidgetHtml(origin);

  return {
    content: [
      {
        type: 'text',
        text: `Opening template "${template.title}" in the CE.SDK Editor.`
      }
    ],
    structuredContent: {
      mode: 'template_editor',
      template: {
        id: template.id,
        title: template.title,
        description: template.description,
        sceneUrl: template.sceneUrl,
        previewUrl: template.previewUrl ?? null,
        layoutType: template.layoutType,
        tags: template.tags ?? [],
        placeholders: []
      },
      placeholderValues: args.placeholderValues ?? {},
      widgetId: `${TEMPLATE_EDITOR_WIDGET.id}-${randomUUID()}`,
      timestamp: new Date().toISOString(),
      exports: ['image/png', 'application/pdf'],
      shouldResetScene: true
    },
    _meta: WIDGET_META,
    html
  };
}

export function toJsonRpcResult(
  id: JsonRpcRequest['id'],
  result: unknown
): JsonRpcResponse {
  return {
    jsonrpc: JSONRPC_VERSION,
    id,
    result
  };
}

export function toJsonRpcError(
  id: JsonRpcRequest['id'],
  code: number,
  message: string,
  data?: unknown
): JsonRpcResponse {
  return {
    jsonrpc: JSONRPC_VERSION,
    id,
    error: {
      code,
      message,
      data
    }
  };
}

// Method handler functions for improved clarity and modularity
async function handleInitialize(
  id: JsonRpcRequest['id'],
  params: unknown
): Promise<JsonRpcResponse> {
  let requestedVersion: string | undefined;

  if (params && typeof params === 'object') {
    const paramObj = params as Record<string, unknown>;
    if (typeof paramObj.protocolVersion === 'string') {
      requestedVersion = paramObj.protocolVersion;
    }
  }

  if (requestedVersion && !SUPPORTED_PROTOCOL_VERSIONS.has(requestedVersion)) {
    return toJsonRpcError(
      id,
      -32602,
      `Unsupported protocol version: ${requestedVersion}`
    );
  }

  const protocolVersion = requestedVersion ?? PROTOCOL_VERSION;

  return toJsonRpcResult(id, {
    protocolVersion,
    serverInfo: SERVER_INFO,
    capabilities: CAPABILITIES
  });
}

async function handleToolsCall(
  id: JsonRpcRequest['id'],
  params: unknown,
  origin: string
): Promise<JsonRpcResponse> {
  if (!params || typeof params !== 'object') {
    throw new Error('Invalid parameters for tools.call');
  }

  const { name, arguments: rawArgs } = params as {
    name?: string;
    arguments?: unknown;
  };

  if (typeof name !== 'string') {
    throw new Error('Tool name is missing or invalid.');
  }

  console.log('[MCP] tools.call', name);

  if (name === 'list_templates') {
    const parsed = LIST_TEMPLATES_INPUT.parse(rawArgs ?? {});
    const result = await listTemplates(origin, parsed);
    return toJsonRpcResult(id, result);
  }

  if (name === 'load_template') {
    const parsed = LOAD_TEMPLATE_INPUT.parse(rawArgs ?? {});
    const result = await loadTemplate(origin, parsed);
    const { html, ...rest } = result;
    return toJsonRpcResult(id, rest);
  }

  throw new Error(`Unknown tool: ${name}`);
}

async function handleResourceRead(
  id: JsonRpcRequest['id'],
  params: unknown,
  origin: string
): Promise<JsonRpcResponse> {
  if (!params || typeof params !== 'object') {
    throw new Error('Invalid parameters for resources.read');
  }

  const { uri } = params as { uri?: string };

  if (uri !== TEMPLATE_EDITOR_WIDGET.templateUri) {
    throw new Error(`Resource ${uri} not found.`);
  }

  const html = await getWidgetHtml(origin);

  return toJsonRpcResult(id, {
    contents: [
      {
        uri: TEMPLATE_EDITOR_WIDGET.templateUri,
        mimeType: 'text/html+skybridge',
        text: html,
        _meta: WIDGET_META
      }
    ]
  });
}

export async function handleRpc(
  request: JsonRpcRequest,
  origin: string
): Promise<JsonRpcResponse> {
  const { id, method, params } = request;

  try {
    let normalizedMethod: string;

    if (typeof method === 'string') {
      normalizedMethod = METHOD_ALIASES.get(method) ?? method;
    } else {
      normalizedMethod = String(method);
    }

    console.log('[MCP] request', normalizedMethod, params ?? null);

    switch (normalizedMethod) {
      case 'initialize':
        return await handleInitialize(id, params);

      case 'notifications/initialized':
        return toJsonRpcResult(id, null);

      case 'shutdown':
        return toJsonRpcResult(id, null);

      case 'tools.list':
        return toJsonRpcResult(id, { tools: TOOLS });

      case 'tools.call':
        return await handleToolsCall(id, params, origin);

      case 'resources.list':
        return toJsonRpcResult(id, { resources: RESOURCES });

      case 'resources.get':
      case 'resources.read':
        return await handleResourceRead(id, params, origin);

      case 'resources.templates.list':
        return toJsonRpcResult(id, { resourceTemplates: RESOURCE_TEMPLATES });

      default:
        return toJsonRpcError(id, -32601, `Unknown method: ${method}`);
    }
  } catch (error) {
    console.error('[MCP] Error handling method', method, error);

    if (error instanceof z.ZodError) {
      return toJsonRpcError(id, -32602, 'Invalid arguments', error.flatten());
    }

    const message = error instanceof Error ? error.message : 'Unknown error';
    return toJsonRpcError(id, -32603, message);
  }
}

export async function processRpcPayload(
  payload: JsonRpcRequest | JsonRpcRequest[],
  origin: string
): Promise<JsonRpcResponse | JsonRpcResponse[]> {
  if (Array.isArray(payload)) {
    return Promise.all(payload.map((entry) => handleRpc(entry, origin)));
  }
  return handleRpc(payload, origin);
}
