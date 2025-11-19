'use client';

import type { PlaceholderFieldDefinition } from '@/templates/catalog';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CreativeEditor from '../components/CreativeEditor';

const FALLBACK_EXPORTS = ['image/png', 'application/pdf'];
const sanitizeFileName = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

const getExtensionFromMime = (mimeType?: string) => {
  switch (mimeType) {
    case 'image/png':
      return 'png';
    case 'image/jpeg':
      return 'jpg';
    case 'image/webp':
      return 'webp';
    case 'application/pdf':
      return 'pdf';
    case 'video/mp4':
      return 'mp4';
    case 'image/svg+xml':
      return 'svg';
    default:
      return 'bin';
  }
};

const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
};

type WidgetMode = 'idle' | 'template_editor' | 'template_editor_error';

type TemplatePayload = {
  id: string;
  title: string;
  description: string;
  sceneUrl: string;
  previewUrl: string | null;
  layoutType: string;
  tags: string[];
  placeholders: PlaceholderFieldDefinition[];
};

type EditorState = {
  template: TemplatePayload;
  placeholderValues: Record<string, string>;
  widgetId: string;
  timestamp: string;
  exports: string[];
  shouldResetScene: boolean;
  revision: string;
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const normalizeKey = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');

function extractPlaceholderField(
  entry: unknown
): PlaceholderFieldDefinition | null {
  if (!entry || typeof entry !== 'object') {
    return null;
  }

  const record = entry as Record<string, unknown>;

  // Determine the id - prioritize explicit id, fallback to normalized label
  let id: string | null = null;
  if (isNonEmptyString(record.id)) {
    id = record.id;
  } else if (isNonEmptyString(record.label)) {
    id = normalizeKey(record.label);
  }

  if (!id) {
    return null;
  }

  // Extract field type with default fallback
  let type: PlaceholderFieldDefinition['type'] = 'text';
  if (isNonEmptyString(record.type)) {
    type = record.type as PlaceholderFieldDefinition['type'];
  }

  // Extract label with id fallback
  const label = isNonEmptyString(record.label) ? record.label : id;

  // Extract optional fields
  const description = isNonEmptyString(record.description)
    ? record.description
    : undefined;

  const blockName = isNonEmptyString(record.blockName)
    ? record.blockName
    : undefined;

  const sampleValue = isNonEmptyString(record.sampleValue)
    ? record.sampleValue
    : undefined;

  const required =
    typeof record.required === 'boolean' ? record.required : undefined;

  return {
    id,
    type,
    label,
    description,
    blockName,
    sampleValue,
    required
  };
}

const sanitizePlaceholders = (input: unknown): PlaceholderFieldDefinition[] => {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map(extractPlaceholderField)
    .filter((field): field is PlaceholderFieldDefinition => field !== null);
};

const sanitizeTemplate = (input: unknown): TemplatePayload | null => {
  if (!input || typeof input !== 'object') {
    return null;
  }

  const record = input as Record<string, unknown>;

  // Extract and validate required fields
  let id: string | null = null;
  if (isNonEmptyString(record.id)) {
    id = record.id;
  } else if (isNonEmptyString(record.title)) {
    id = normalizeKey(record.title);
  }

  const sceneUrl = isNonEmptyString(record.sceneUrl) ? record.sceneUrl : null;

  // Both id and sceneUrl are required
  if (!id || !sceneUrl) {
    return null;
  }

  // Extract fields with defaults
  const title = isNonEmptyString(record.title) ? record.title : id;
  const description = isNonEmptyString(record.description)
    ? record.description
    : 'Template without description';
  const previewUrl = isNonEmptyString(record.previewUrl)
    ? record.previewUrl
    : null;
  const layoutType = isNonEmptyString(record.layoutType)
    ? record.layoutType
    : 'unknown';

  // Process tags array
  const tags = Array.isArray(record.tags)
    ? record.tags
        .map((tag) => (isNonEmptyString(tag) ? tag : null))
        .filter((tag): tag is string => tag !== null)
    : [];

  // Process placeholders
  const placeholders = sanitizePlaceholders(record.placeholders);

  return {
    id,
    title,
    description,
    sceneUrl,
    previewUrl,
    layoutType,
    tags,
    placeholders
  };
};

const sanitizePlaceholderValues = (input: unknown) => {
  if (!input || typeof input !== 'object') return {};
  const result: Record<string, string> = {};
  Object.entries(input as Record<string, unknown>).forEach(([key, value]) => {
    if (isNonEmptyString(key) && value != null) {
      const serialized = String(value).trim();
      if (serialized.length > 0) {
        result[key] = serialized;
      }
    }
  });
  return result;
};

const blockSupportsType = (
  type: PlaceholderFieldDefinition['type'],
  blockType: string
) => {
  if (type === 'image') {
    return blockType.includes('//ly.img.ubq/graphic');
  }
  return blockType.includes('//ly.img.ubq/text');
};

const applyPlaceholderValues = async (
  engine: CreativeEditorSDK['engine'],
  template: TemplatePayload,
  values: Record<string, string>
) => {
  if (!template.placeholders || template.placeholders.length === 0) {
    return;
  }

  if (
    !engine?.block ||
    typeof engine.block.findAllPlaceholders !== 'function'
  ) {
    return;
  }

  const placeholderIds: number[] = engine.block.findAllPlaceholders() || [];
  if (!placeholderIds.length) {
    return;
  }

  const metadata = placeholderIds.map((id) => {
    const name = engine.block.getName?.(id) ?? '';
    const type = engine.block.getType?.(id) ?? '';
    return {
      id,
      name,
      normalized: normalizeKey(name || ''),
      type
    };
  });

  const getCandidateId = (field: PlaceholderFieldDefinition): number | null => {
    const candidates = [
      field.blockName,
      field.id,
      field.label,
      normalizeKey(field.label || field.id)
    ]
      .filter(Boolean)
      .map((entry) => normalizeKey(String(entry)));

    for (const candidate of candidates) {
      const match = metadata.find(
        (entry) =>
          entry.normalized === candidate &&
          blockSupportsType(field.type, entry.type)
      );
      if (match) {
        return match.id;
      }
    }

    return (
      metadata.find((entry) => blockSupportsType(field.type, entry.type))?.id ??
      null
    );
  };

  for (const field of template.placeholders) {
    const rawValue = values[field.id];
    if (!isNonEmptyString(rawValue)) {
      continue;
    }

    const blockId = getCandidateId(field);
    if (!blockId) continue;
    const preparedValue = (() => {
      if (field.type === 'date') {
        const parsed = new Date(rawValue);
        if (!Number.isNaN(parsed.getTime())) {
          return parsed.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
        }
      }
      return rawValue;
    })();

    try {
      if (field.type === 'image') {
        const fillId = (() => {
          const currentFill = engine.block.getFill?.(blockId);
          if (
            currentFill &&
            engine.block.isValid?.(currentFill) &&
            engine.block
              .getType?.(currentFill)
              ?.includes('//ly.img.ubq/fill/image')
          ) {
            return currentFill;
          }
          const newFill = engine.block.createFill?.('image');
          if (newFill) {
            engine.block.setFill?.(blockId, newFill);
          }
          return newFill ?? currentFill ?? null;
        })();

        if (!fillId || !engine.block.isValid?.(fillId)) continue;

        engine.block.setString?.(fillId, 'fill/image/imageFileURI', rawValue);
        engine.block.resetCrop?.(blockId);
        if (engine.block.supportsContentFillMode?.(blockId)) {
          engine.block.setContentFillMode?.(blockId, 'Cover');
        }
        engine.block.setPlaceholderEnabled?.(blockId, false);
      } else {
        engine.block.setString?.(blockId, 'text/text', preparedValue);
        engine.block.setPlaceholderEnabled?.(blockId, false);
      }
      engine.block.setSelected?.(blockId, false);
    } catch (error) {
      console.warn('Failed to apply placeholder value', {
        fieldId: field.id,
        error
      });
    }
  }
};

function ErrorView({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center bg-slate-950 p-6 text-center text-slate-200">
      <div>
        {/* eslint-disable-next-line react/forbid-elements */}
        <h2 className="text-lg font-semibold">CE.SDK tool error</h2>
        <p className="mt-2 text-sm text-slate-400">{message}</p>
      </div>
    </div>
  );
}

function LoadingView() {
  return (
    <div className="flex h-full items-center justify-center bg-slate-950 text-slate-400">
      <div className="space-y-1 text-center text-sm">
        <p>Waiting for ChatGPT instructions…</p>
        <p className="text-xs text-slate-500">
          The editor appears automatically once a template loads.
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [mode, setMode] = useState<WidgetMode>('idle');
  const [editorState, setEditorState] = useState<EditorState | null>(null);
  const [editorReady, setEditorReady] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [widgetKey, setWidgetKey] = useState<string>('initial');

  const editorRef = useRef<CreativeEditorSDK | null>(null);
  const widgetKeyRef = useRef(widgetKey);
  const pendingSceneRef = useRef<string | null>(null);
  const editorStateRef = useRef<EditorState | null>(null);
  const activeTemplateIdRef = useRef<string | null>(null);
  const restoredFromPendingRef = useRef(false);
  const lastProcessedPayloadRef = useRef<string | null>(null);

  const handleExport = useCallback(
    async (blobs: Blob[], exportOptions?: { mimeType?: string }) => {
      if (!blobs || blobs.length === 0) {
        console.warn('[CE.SDK] Export triggered without blob data');
        return;
      }

      const baseTitle =
        sanitizeFileName(
          editorState?.template.title ??
            `cesdk-export-${new Date().toISOString()}`
        ) || 'cesdk-export';

      blobs.forEach((blob, index) => {
        const mime =
          exportOptions?.mimeType || blob.type || editorState?.exports[0];
        const extension = getExtensionFromMime(mime);
        const suffix = blobs.length > 1 ? `-${index + 1}` : '';
        const filename = `${baseTitle}${suffix}.${extension}`;
        console.debug('[CE.SDK] Downloading export blob', { filename, mime });
        triggerDownload(blob, filename);
      });
    },
    [editorState]
  );

  useEffect(() => {
    console.debug('[CE.SDK] state snapshot', {
      mode,
      widgetKey,
      hasEditorState: Boolean(editorState),
      editorReady
    });
  }, [mode, widgetKey, editorState, editorReady]);

  useEffect(() => {
    widgetKeyRef.current = widgetKey;
  }, [widgetKey]);

  useEffect(() => {
    editorStateRef.current = editorState;
  }, [editorState]);

  const handleToolValue = useCallback(async (value: unknown) => {
    if (!value || typeof value !== 'object') {
      return;
    }

    console.debug('[CE.SDK] raw tool payload candidate', value);

    const root = value as Record<string, unknown>;
    const result =
      root.result && typeof root.result === 'object'
        ? (root.result as Record<string, unknown>)
        : undefined;
    let structured =
      result && typeof result.structuredContent === 'object'
        ? (result.structuredContent as Record<string, unknown>)
        : typeof root.structuredContent === 'object'
        ? (root.structuredContent as Record<string, unknown>)
        : undefined;

    if (!structured) {
      const maybeDirect = root;
      if (
        typeof maybeDirect.mode === 'string' ||
        'template' in maybeDirect ||
        'placeholderValues' in maybeDirect
      ) {
        structured = maybeDirect;
      }
    }

    if (!structured) {
      console.warn(
        '[CE.SDK] Ignored payload without structured content',
        value
      );
      return;
    }

    const structuredRecord = structured as Record<string, unknown>;

    const nextWidgetId = isNonEmptyString(structuredRecord.widgetId)
      ? (structuredRecord.widgetId as string)
      : isNonEmptyString(root.widgetId)
      ? (root.widgetId as string)
      : undefined;

    if (
      nextWidgetId &&
      nextWidgetId.length > 0 &&
      nextWidgetId !== widgetKeyRef.current
    ) {
      const currentInstance = editorRef.current;
      if (currentInstance?.engine) {
        try {
          const savedScene = await currentInstance.engine.scene.saveToString();
          pendingSceneRef.current = savedScene;
          console.debug('[CE.SDK] Scene saved before widget switch');
        } catch (error) {
          console.error(
            '[CE.SDK] CRITICAL: Failed to save scene before widget switch',
            {
              error,
              stack: error instanceof Error ? error.stack : undefined
            }
          );

          // Alert user about potential data loss
          // eslint-disable-next-line no-alert, no-restricted-globals
          const shouldContinue = confirm(
            'Warning: Unable to save your current work before switching templates. ' +
              'If you continue, your changes will be lost. Would you like to continue anyway?'
          );

          if (!shouldContinue) {
            // Cancel the widget switch
            return;
          }

          pendingSceneRef.current = null;
        }
      } else {
        pendingSceneRef.current = null;
      }

      widgetKeyRef.current = nextWidgetId;
      setWidgetKey(nextWidgetId);
      lastProcessedPayloadRef.current = null;
    }

    console.debug('[CE.SDK] handleToolValue resolved payload', {
      mode: structuredRecord.mode,
      widgetId: widgetKeyRef.current,
      hasTemplate: Boolean(structuredRecord.template)
    });

    const modeRaw = isNonEmptyString(structuredRecord.mode)
      ? (structuredRecord.mode as string)
      : undefined;

    if (modeRaw === 'template_gallery') {
      const templatesCount = Array.isArray(structuredRecord.templates)
        ? structuredRecord.templates.length
        : 0;
      console.debug('[CE.SDK] Ignoring template_gallery payload', {
        templatesCount,
        layoutType: structuredRecord.layoutType
      });
      return;
    }

    let modeValue: WidgetMode | undefined;
    if (
      modeRaw === 'template_editor' ||
      modeRaw === 'template_editor_error' ||
      modeRaw === 'idle'
    ) {
      modeValue = modeRaw;
    }

    if (modeValue === 'template_editor') {
      const template = sanitizeTemplate(structuredRecord.template);
      if (!template) {
        setStatusMessage('Received invalid template data from the server.');
        setMode('template_editor_error');
        return;
      }

      const placeholderValues = sanitizePlaceholderValues(
        structuredRecord.placeholderValues
      );
      const exports = Array.isArray(structuredRecord.exports)
        ? (structuredRecord.exports as unknown[])
            .map((entry) => (isNonEmptyString(entry) ? entry : null))
            .filter(Boolean)
            .map((entry) => entry!)
        : FALLBACK_EXPORTS;
      const timestamp = isNonEmptyString(structuredRecord.timestamp)
        ? (structuredRecord.timestamp as string)
        : new Date().toISOString();
      const shouldResetScene = Boolean(structuredRecord.shouldResetScene);
      const widgetId = nextWidgetId ?? widgetKeyRef.current;

      if (shouldResetScene) {
        pendingSceneRef.current = null;
      }

      const nextEditorState: EditorState = {
        template,
        placeholderValues,
        widgetId,
        timestamp,
        exports: exports.length ? exports : FALLBACK_EXPORTS,
        shouldResetScene,
        revision: `${widgetId}:${timestamp}`
      };

      console.debug('[CE.SDK] Switching to template_editor mode', {
        widgetId,
        templateId: template.id,
        timestamp
      });
      setEditorState(nextEditorState);
      setMode('template_editor');
      setStatusMessage(null);
      return;
    }

    if (modeValue === 'template_editor_error') {
      const message = isNonEmptyString(structuredRecord.message)
        ? (structuredRecord.message as string)
        : 'Unknown error while processing the template.';
      setStatusMessage(message);
      setEditorState(null);
      setMode('template_editor_error');
      return;
    }

    if (modeValue === 'idle') {
      setEditorState(null);
      setMode('idle');
      setStatusMessage(null);
      return;
    }

    console.debug('[CE.SDK] No matching mode handler executed', { modeRaw });
  }, []);

  // Helper function to setup OpenAI tool output monitoring
  function setupOpenAIMonitoring(
    onPayloadReceived: (payload: unknown) => void
  ) {
    let openaiRef: Record<string, unknown> | null = null;
    let originalDescriptor: PropertyDescriptor | undefined;
    let pollInterval: number | null = null;

    const emitUpdate = (detail: unknown) => {
      const event = new CustomEvent('openai:tool-output', { detail });
      try {
        window.dispatchEvent(event);
      } catch (error) {
        console.warn('Failed to dispatch openai:tool-output event', error);
      }
    };

    const processCandidate = (candidate: unknown) => {
      if (candidate === undefined || candidate === null) {
        return;
      }

      let serialized: string;
      try {
        serialized = JSON.stringify(candidate);
      } catch (error) {
        serialized = `${Date.now()}`;
      }

      if (serialized === lastProcessedPayloadRef.current) {
        return;
      }

      lastProcessedPayloadRef.current = serialized;
      console.debug('[CE.SDK] Processing tool payload', candidate);
      emitUpdate(candidate);
      onPayloadReceived(candidate);
    };

    const collectToolOutputs = () => {
      if (!openaiRef) {
        return;
      }

      const candidates: unknown[] = [];
      if ('toolOutput' in openaiRef) {
        candidates.push(openaiRef.toolOutput);
      }

      const outputs = openaiRef.toolOutputs as unknown;
      if (Array.isArray(outputs) && outputs.length > 0) {
        candidates.push(outputs[outputs.length - 1]);
      }

      for (const candidate of candidates) {
        processCandidate(candidate);
      }
    };

    const attachToOpenAI = (): boolean => {
      const existing = (window as unknown as Record<string, unknown>).openai as
        | Record<string, unknown>
        | undefined;

      if (!existing || typeof existing !== 'object') {
        return false;
      }

      openaiRef = existing;
      originalDescriptor = Object.getOwnPropertyDescriptor(
        openaiRef,
        'toolOutput'
      );

      let currentValue = openaiRef.toolOutput;

      try {
        Object.defineProperty(openaiRef, 'toolOutput', {
          configurable: true,
          enumerable: true,
          get() {
            return currentValue;
          },
          set(newValue: unknown) {
            currentValue = newValue;
            processCandidate(newValue);
          }
        });
      } catch (error) {
        console.debug('Unable to redefine openai.toolOutput property', error);
      }

      processCandidate(currentValue);

      if (!pollInterval) {
        pollInterval = window.setInterval(collectToolOutputs, 200);
        collectToolOutputs();
      }

      return true;
    };

    const cleanup = () => {
      if (pollInterval) {
        window.clearInterval(pollInterval);
      }

      if (openaiRef) {
        try {
          if (originalDescriptor) {
            Object.defineProperty(openaiRef, 'toolOutput', originalDescriptor);
          } else {
            delete openaiRef.toolOutput;
          }
        } catch (error) {
          console.debug(
            'Unable to restore openai.toolOutput descriptor',
            error
          );
        }
      }

      emitUpdate(null);
      lastProcessedPayloadRef.current = null;
    };

    // Try to attach immediately
    if (!attachToOpenAI()) {
      // If not available, poll until it becomes available
      const waitInterval = window.setInterval(() => {
        if (attachToOpenAI()) {
          window.clearInterval(waitInterval);
        }
      }, 100);

      return () => {
        window.clearInterval(waitInterval);
        cleanup();
      };
    }

    return cleanup;
  }

  // Monitor OpenAI tool outputs
  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    return setupOpenAIMonitoring((payload) => {
      void handleToolValue(payload);
    });
  }, [handleToolValue]);

  // Helper function to process SSE stream data
  function processSseStream(
    buffer: string,
    onPayload: (payload: unknown) => void,
    isFlush = false
  ): string {
    let remainingBuffer = buffer;

    const processDataLines = (chunk: string) => {
      const dataLines = chunk
        .split('\n')
        .filter((line) => line.startsWith('data:'));

      for (const line of dataLines) {
        const jsonText = line.slice(5).trim();
        if (!jsonText) continue;

        try {
          const payload = JSON.parse(jsonText);
          onPayload(payload);
        } catch (error) {
          const context = isFlush ? ' (flush)' : '';
          console.warn(`Failed to parse MCP payload${context}`, {
            error,
            jsonText
          });
        }
      }
    };

    if (isFlush) {
      if (remainingBuffer.trim()) {
        processDataLines(remainingBuffer);
      }
      return '';
    }

    let separatorIndex = remainingBuffer.indexOf('\n\n');
    while (separatorIndex >= 0) {
      const chunk = remainingBuffer.slice(0, separatorIndex);
      remainingBuffer = remainingBuffer.slice(separatorIndex + 2);
      processDataLines(chunk);
      separatorIndex = remainingBuffer.indexOf('\n\n');
    }

    return remainingBuffer;
  }

  // Helper function to extract URL from fetch arguments
  function extractUrlFromFetchArgs(input: RequestInfo | URL): string {
    if (typeof input === 'string') {
      return input;
    }

    if (input instanceof Request) {
      return input.url;
    }

    if (typeof input === 'object' && input && 'url' in input) {
      return String((input as { url: unknown }).url);
    }

    return '';
  }

  // Intercept MCP SSE streams
  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const originalFetch = window.fetch.bind(window);

    window.fetch = async (...args) => {
      const response = await originalFetch(...args);

      try {
        const url = extractUrlFromFetchArgs(args[0]);
        const isMcpSse =
          typeof url === 'string' &&
          url.includes('/mcp') &&
          response.headers.get('content-type')?.includes('text/event-stream');

        if (isMcpSse) {
          const clone = response.clone();
          const reader = clone.body?.getReader();

          if (reader) {
            const decoder = new TextDecoder();
            let buffer = '';

            // Process stream chunks
            while (true) {
              const { value, done } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              buffer = processSseStream(buffer, (payload) => {
                void handleToolValue(payload);
              });
            }

            // Process any remaining buffer
            processSseStream(
              buffer,
              (payload) => {
                void handleToolValue(payload);
              },
              true
            );
          }
        }
      } catch (error) {
        console.warn('MCP fetch interception failed', error);
      }

      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [handleToolValue]);

  useEffect(() => {
    return () => {
      editorRef.current = null;
      pendingSceneRef.current = null;
      setEditorReady(false);
    };
  }, []);

  useEffect(() => {
    if (!editorReady) return;
    if (!editorState) return;

    const instance = editorRef.current;
    if (!instance?.engine) return;

    let cancelled = false;

    const run = async () => {
      const engine = instance.engine;

      console.debug('[CE.SDK] applyTemplate effect triggered', {
        ready: editorReady,
        hasState: Boolean(editorState),
        templateId: editorState?.template.id,
        shouldReset: editorState?.shouldResetScene,
        restoredFromPending: restoredFromPendingRef.current
      });

      try {
        const templateChanged =
          activeTemplateIdRef.current !== editorState.template.id;
        const shouldRestore = restoredFromPendingRef.current;

        if (
          templateChanged ||
          (!shouldRestore && editorState.shouldResetScene)
        ) {
          await engine.scene.loadFromArchiveURL(editorState.template.sceneUrl);
          activeTemplateIdRef.current = editorState.template.id;
          pendingSceneRef.current = null;
          restoredFromPendingRef.current = false;
          console.debug('[CE.SDK] loaded template scene from archive', {
            templateId: editorState.template.id
          });
        }

        if (cancelled) return;

        await applyPlaceholderValues(
          engine,
          editorState.template,
          editorState.placeholderValues
        );

        console.debug('[CE.SDK] applied placeholder values', {
          templateId: editorState.template.id,
          placeholders: Object.keys(editorState.placeholderValues)
        });

        if (!activeTemplateIdRef.current) {
          activeTemplateIdRef.current = editorState.template.id;
        }
      } catch (error) {
        console.error('Failed to apply template updates', error);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [editorReady, editorState]);

  const editorComponent = useMemo(() => {
    if (mode !== 'template_editor' || !editorState) {
      return null;
    }

    console.debug('[CE.SDK] rendering CreativeEditor widget', {
      widgetKey,
      templateId: editorState.template.id,
      revision: editorState.revision
    });

    return (
      <div className="flex h-full flex-col overflow-hidden bg-slate-950">
        <header className="flex items-center justify-between border-b border-slate-800 px-4 py-2 text-sm text-slate-200">
          <div>
            <p className="font-semibold text-slate-100">
              {editorState.template.title}
            </p>
            <p className="text-xs text-slate-400">
              {editorState.template.description}
            </p>
          </div>
          <div className="text-xs text-slate-400">
            Exports: {editorState.exports.join(', ')}
          </div>
        </header>
        <div className="flex-1">
          <CreativeEditor
            key={widgetKey}
            config={{
              theme: 'light',
              role: 'Creator',
              callbacks: {
                onExport: handleExport,
                onUpload: 'local'
              },
              ui: {
                elements: {
                  navigation: {
                    action: {
                      export: {
                        show: true,
                        format: editorState.exports as any
                      }
                    }
                  }
                }
              }
            }}
            onReady={(instance) => {
              editorRef.current = instance;
              setEditorReady(false);
              restoredFromPendingRef.current = false;

              console.debug('[CE.SDK] CreativeEditor ready callback', {
                widgetKey,
                templateId: editorState.template.id
              });

              const pendingScene = pendingSceneRef.current;
              const latestEditorState = editorStateRef.current;
              const shouldRestore = Boolean(
                pendingScene &&
                  latestEditorState &&
                  latestEditorState.template.id === activeTemplateIdRef.current
              );

              void (async () => {
                try {
                  if (shouldRestore && pendingScene) {
                    await instance.engine.scene.loadFromString(
                      pendingScene,
                      true
                    );
                    restoredFromPendingRef.current = true;
                    console.debug('[CE.SDK] Scene restored successfully');
                  } else {
                    await instance.createDesignScene();
                    restoredFromPendingRef.current = false;
                  }
                } catch (error) {
                  console.error('[CE.SDK] Failed to restore previous scene', {
                    error,
                    hadPendingScene: Boolean(pendingScene),
                    stack: error instanceof Error ? error.stack : undefined
                  });

                  restoredFromPendingRef.current = false;

                  // Inform user of data loss
                  // eslint-disable-next-line no-alert
                  alert(
                    'Warning: Your previous changes could not be restored. ' +
                      'The template has been loaded in its default state.'
                  );

                  // Try to create default scene as fallback
                  try {
                    await instance.createDesignScene();
                  } catch (fallbackError) {
                    console.error(
                      '[CE.SDK] CRITICAL: Cannot create design scene',
                      fallbackError
                    );
                    throw fallbackError; // Propagate - editor is unusable
                  }
                } finally {
                  pendingSceneRef.current = null;
                  setEditorReady(true);
                }
              })();
            }}
          />
        </div>
      </div>
    );
  }, [editorState, mode, widgetKey, handleExport]);

  if (mode === 'template_editor' && editorComponent) {
    return editorComponent;
  }

  if (mode === 'template_editor_error' && statusMessage) {
    return <ErrorView message={statusMessage} />;
  }

  return <LoadingView />;
}
