import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { parseOverrides, validateBuildArtifacts, cesdkLocal } from './vite-config-cesdk-local';
import * as fs from 'fs';
import * as path from 'path';
import * as childProcess from 'child_process';
import type { Plugin, UserConfig, ConfigEnv, ViteDevServer } from 'vite';

// Mock fs module
vi.mock('fs', () => ({
  existsSync: vi.fn()
}));

// Mock child_process module
vi.mock('child_process', () => ({
  execFileSync: vi.fn()
}));

// Helper to call plugin config hook (handles both function and object forms)
function callConfigHook(plugin: Plugin, config: UserConfig, env: ConfigEnv) {
  const hook = plugin.config;
  if (typeof hook === 'function') {
    return hook.call({} as any, config, env);
  } else if (hook && typeof hook === 'object' && 'handler' in hook) {
    return hook.handler.call({} as any, config, env);
  }
  return undefined;
}

// Helper to call plugin configureServer hook
function callConfigureServerHook(plugin: Plugin, server: ViteDevServer) {
  const hook = plugin.configureServer;
  if (typeof hook === 'function') {
    return hook.call({} as any, server);
  } else if (hook && typeof hook === 'object' && 'handler' in hook) {
    return hook.handler.call({} as any, server);
  }
  return undefined;
}

describe('parseOverrides', () => {
  it('should return empty set for undefined', () => {
    expect(parseOverrides(undefined)).toEqual(new Set());
  });

  it('should parse "true" as all packages', () => {
    expect(parseOverrides('true')).toEqual(new Set(['cesdk', 'engine', 'node']));
  });

  it('should parse "True" (case insensitive) as all packages', () => {
    expect(parseOverrides('True')).toEqual(new Set(['cesdk', 'engine', 'node']));
  });

  it('should parse "1" as all packages', () => {
    expect(parseOverrides('1')).toEqual(new Set(['cesdk', 'engine', 'node']));
  });

  it('should parse "all" as all packages', () => {
    expect(parseOverrides('all')).toEqual(new Set(['cesdk', 'engine', 'node']));
  });

  it('should parse "cesdk" as cesdk only', () => {
    expect(parseOverrides('cesdk')).toEqual(new Set(['cesdk']));
  });

  it('should parse "engine" as engine only', () => {
    expect(parseOverrides('engine')).toEqual(new Set(['engine']));
  });

  it('should parse "cesdk,engine" as both', () => {
    expect(parseOverrides('cesdk,engine')).toEqual(new Set(['cesdk', 'engine']));
  });

  it('should parse "engine,cesdk" as both (order independent)', () => {
    expect(parseOverrides('engine,cesdk')).toEqual(new Set(['cesdk', 'engine']));
  });

  it('should handle whitespace in values', () => {
    expect(parseOverrides(' cesdk ')).toEqual(new Set(['cesdk']));
    expect(parseOverrides(' true ')).toEqual(new Set(['cesdk', 'engine', 'node']));
  });

  it('should return empty set for empty string', () => {
    expect(parseOverrides('')).toEqual(new Set());
  });

  it('should return empty set for invalid values', () => {
    expect(parseOverrides('invalid')).toEqual(new Set());
  });
});

describe('validateBuildArtifacts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should run web build if cesdk build missing', () => {
    const mockExistsSync = vi.mocked(fs.existsSync);
    const mockExecFileSync = vi.mocked(childProcess.execFileSync);
    mockExistsSync.mockReturnValue(false);

    validateBuildArtifacts(new Set(['cesdk']), '/fake/path');

    expect(mockExecFileSync).toHaveBeenCalledWith(
      'yarn',
      ['web:build:development'],
      expect.objectContaining({ cwd: '/fake/path', stdio: 'inherit' })
    );
  });

  it('should run web build if engine build missing', () => {
    const mockExistsSync = vi.mocked(fs.existsSync);
    const mockExecFileSync = vi.mocked(childProcess.execFileSync);
    mockExistsSync.mockReturnValue(false);

    validateBuildArtifacts(new Set(['engine']), '/fake/path');

    expect(mockExecFileSync).toHaveBeenCalledWith(
      'yarn',
      ['web:build:development'],
      expect.objectContaining({ cwd: '/fake/path', stdio: 'inherit' })
    );
  });

  it('should run web build once if both cesdk and engine missing', () => {
    const mockExistsSync = vi.mocked(fs.existsSync);
    const mockExecFileSync = vi.mocked(childProcess.execFileSync);
    mockExistsSync.mockReturnValue(false);

    validateBuildArtifacts(new Set(['cesdk', 'engine']), '/fake/path');

    // Should only call web:build:development once (not twice)
    expect(mockExecFileSync).toHaveBeenCalledTimes(1);
    expect(mockExecFileSync).toHaveBeenCalledWith(
      'yarn',
      ['web:build:development'],
      expect.objectContaining({ cwd: '/fake/path', stdio: 'inherit' })
    );
  });

  it('should run web build if node build missing', () => {
    const mockExistsSync = vi.mocked(fs.existsSync);
    const mockExecFileSync = vi.mocked(childProcess.execFileSync);
    mockExistsSync.mockReturnValue(false);

    validateBuildArtifacts(new Set(['node']), '/fake/path');

    // web:build:development includes js_node
    expect(mockExecFileSync).toHaveBeenCalledWith(
      'yarn',
      ['web:build:development'],
      expect.objectContaining({ cwd: '/fake/path', stdio: 'inherit' })
    );
  });

  it('should throw if build command fails', () => {
    const mockExistsSync = vi.mocked(fs.existsSync);
    const mockExecFileSync = vi.mocked(childProcess.execFileSync);
    mockExistsSync.mockReturnValue(false);
    mockExecFileSync.mockImplementation(() => {
      throw new Error('Build failed');
    });

    expect(() => validateBuildArtifacts(new Set(['cesdk']), '/fake/path'))
      .toThrow(/Failed to build local packages/);
  });

  it('should pass if cesdk build exists', () => {
    const mockExistsSync = vi.mocked(fs.existsSync);
    const mockExecFileSync = vi.mocked(childProcess.execFileSync);
    mockExistsSync.mockReturnValue(true);

    validateBuildArtifacts(new Set(['cesdk']), '/fake/path');

    expect(mockExecFileSync).not.toHaveBeenCalled();
  });

  it('should pass if engine build exists', () => {
    const mockExistsSync = vi.mocked(fs.existsSync);
    const mockExecFileSync = vi.mocked(childProcess.execFileSync);
    mockExistsSync.mockReturnValue(true);

    validateBuildArtifacts(new Set(['engine']), '/fake/path');

    expect(mockExecFileSync).not.toHaveBeenCalled();
  });

  it('should pass if both builds exist', () => {
    const mockExistsSync = vi.mocked(fs.existsSync);
    const mockExecFileSync = vi.mocked(childProcess.execFileSync);
    mockExistsSync.mockReturnValue(true);

    validateBuildArtifacts(new Set(['cesdk', 'engine']), '/fake/path');

    expect(mockExecFileSync).not.toHaveBeenCalled();
  });

  it('should not check builds if no overrides', () => {
    const mockExistsSync = vi.mocked(fs.existsSync);
    const mockExecFileSync = vi.mocked(childProcess.execFileSync);
    mockExistsSync.mockReturnValue(false);

    validateBuildArtifacts(new Set(), '/fake/path');

    expect(mockExistsSync).not.toHaveBeenCalled();
    expect(mockExecFileSync).not.toHaveBeenCalled();
  });

  it('should check correct paths for cesdk build', () => {
    const mockExistsSync = vi.mocked(fs.existsSync);
    mockExistsSync.mockReturnValue(true);

    validateBuildArtifacts(new Set(['cesdk']), '/test/root');

    expect(mockExistsSync).toHaveBeenCalledWith(
      path.resolve('/test/root', 'apps/cesdk_web/build/index.js')
    );
  });

  it('should check correct paths for engine build', () => {
    const mockExistsSync = vi.mocked(fs.existsSync);
    mockExistsSync.mockReturnValue(true);

    validateBuildArtifacts(new Set(['engine']), '/test/root');

    expect(mockExistsSync).toHaveBeenCalledWith(
      path.resolve('/test/root', 'bindings/wasm/js_web/build/index.js')
    );
  });
});

describe('cesdkLocal plugin', () => {
  let originalEnv: string | undefined;

  beforeEach(() => {
    originalEnv = process.env.CESDK_USE_LOCAL;
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env.CESDK_USE_LOCAL = originalEnv;
  });

  it('should apply aliases in build mode when env var set', () => {
    process.env.CESDK_USE_LOCAL = 'true';
    const mockExistsSync = vi.mocked(fs.existsSync);
    const mockExecFileSync = vi.mocked(childProcess.execFileSync);
    mockExistsSync.mockReturnValue(true);
    mockExecFileSync.mockReturnValue(Buffer.from(''));

    const plugin = cesdkLocal();
    const config = callConfigHook(plugin, {}, { command: 'build', mode: 'production' });

    // Build mode now supports local packages
    expect(config?.resolve?.alias?.['@cesdk/cesdk-js']).toContain('cesdk_web/build');
    expect(config?.resolve?.alias?.['@cesdk/engine']).toContain('js_web/build');
  });

  it('should log info in build mode when env var set', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    process.env.CESDK_USE_LOCAL = 'true';
    const mockExistsSync = vi.mocked(fs.existsSync);
    const mockExecFileSync = vi.mocked(childProcess.execFileSync);
    mockExistsSync.mockReturnValue(true);
    mockExecFileSync.mockReturnValue(Buffer.from(''));

    const plugin = cesdkLocal();
    callConfigHook(plugin, {}, { command: 'build', mode: 'production' });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Building with local packages')
    );

    consoleSpy.mockRestore();
  });

  it('should apply cesdk alias in dev mode', () => {
    process.env.CESDK_USE_LOCAL = 'cesdk';
    const mockExistsSync = vi.mocked(fs.existsSync);
    mockExistsSync.mockReturnValue(true);

    const plugin = cesdkLocal();
    const config = callConfigHook(plugin, {}, { command: 'serve', mode: 'development' });

    expect(config?.resolve?.alias?.['@cesdk/cesdk-js']).toContain('cesdk_web/build');
  });

  it('should apply engine alias in dev mode', () => {
    process.env.CESDK_USE_LOCAL = 'engine';
    const mockExistsSync = vi.mocked(fs.existsSync);
    mockExistsSync.mockReturnValue(true);

    const plugin = cesdkLocal();
    const config = callConfigHook(plugin, {}, { command: 'serve', mode: 'development' });

    expect(config?.resolve?.alias?.['@cesdk/engine']).toContain('js_web/build');
  });

  it('should apply both aliases when using "true"', () => {
    process.env.CESDK_USE_LOCAL = 'true';
    const mockExistsSync = vi.mocked(fs.existsSync);
    mockExistsSync.mockReturnValue(true);

    const plugin = cesdkLocal();
    const config = callConfigHook(plugin, {}, { command: 'serve', mode: 'development' });

    expect(config?.resolve?.alias?.['@cesdk/cesdk-js']).toContain('cesdk_web/build');
    expect(config?.resolve?.alias?.['@cesdk/engine']).toContain('js_web/build');
  });

  it('should not apply aliases when env var not set', () => {
    delete process.env.CESDK_USE_LOCAL;

    const plugin = cesdkLocal();
    const config = callConfigHook(plugin, {}, { command: 'serve', mode: 'development' });

    expect(config?.resolve?.alias?.['@cesdk/cesdk-js']).toBeUndefined();
    expect(config?.resolve?.alias?.['@cesdk/engine']).toBeUndefined();
  });

  it('should expose env var to client code', () => {
    process.env.CESDK_USE_LOCAL = 'cesdk';
    const mockExistsSync = vi.mocked(fs.existsSync);
    mockExistsSync.mockReturnValue(true);

    const plugin = cesdkLocal();
    const config = callConfigHook(plugin, {}, { command: 'serve', mode: 'development' });

    expect(config?.define?.['import.meta.env.CESDK_USE_LOCAL']).toBe('"cesdk"');
  });

  it('should add watchers for local packages', () => {
    process.env.CESDK_USE_LOCAL = 'all';
    const mockExistsSync = vi.mocked(fs.existsSync);
    mockExistsSync.mockReturnValue(true);

    const plugin = cesdkLocal();
    const mockServer = {
      watcher: { add: vi.fn() },
      middlewares: { use: vi.fn() }
    };
    callConfigureServerHook(plugin, mockServer as any);

    // 'all' includes cesdk, engine, and node (3 watchers)
    expect(mockServer.watcher.add).toHaveBeenCalledTimes(3);
    expect(mockServer.watcher.add).toHaveBeenCalledWith(
      expect.stringContaining('cesdk_web/build')
    );
    expect(mockServer.watcher.add).toHaveBeenCalledWith(
      expect.stringContaining('js_web/build')
    );
    expect(mockServer.watcher.add).toHaveBeenCalledWith(
      expect.stringContaining('js_node/build')
    );
  });

  it('should not add watchers when no overrides', () => {
    delete process.env.CESDK_USE_LOCAL;

    const plugin = cesdkLocal();
    const mockServer = { watcher: { add: vi.fn() } };
    callConfigureServerHook(plugin, mockServer as any);

    expect(mockServer.watcher.add).not.toHaveBeenCalled();
  });

  it('should add watcher only for cesdk when only cesdk override', () => {
    process.env.CESDK_USE_LOCAL = 'cesdk';
    const mockExistsSync = vi.mocked(fs.existsSync);
    mockExistsSync.mockReturnValue(true);

    const plugin = cesdkLocal();
    const mockServer = {
      watcher: { add: vi.fn() },
      middlewares: { use: vi.fn() }
    };
    callConfigureServerHook(plugin, mockServer as any);

    expect(mockServer.watcher.add).toHaveBeenCalledTimes(1);
    expect(mockServer.watcher.add).toHaveBeenCalledWith(
      expect.stringContaining('cesdk_web/build')
    );
  });

  it('should run build automatically if artifacts missing in dev mode', () => {
    process.env.CESDK_USE_LOCAL = 'true';
    const mockExistsSync = vi.mocked(fs.existsSync);
    const mockExecFileSync = vi.mocked(childProcess.execFileSync);
    mockExistsSync.mockReturnValue(false);
    mockExecFileSync.mockReturnValue(Buffer.from('')); // Simulate successful build

    const plugin = cesdkLocal();
    callConfigHook(plugin, {}, { command: 'serve', mode: 'development' });

    expect(mockExecFileSync).toHaveBeenCalledWith(
      'yarn',
      ['web:build:development'],
      expect.objectContaining({ stdio: 'inherit' })
    );
  });

  it('should throw if build command fails in dev mode', () => {
    process.env.CESDK_USE_LOCAL = 'true';
    const mockExistsSync = vi.mocked(fs.existsSync);
    const mockExecFileSync = vi.mocked(childProcess.execFileSync);
    mockExistsSync.mockReturnValue(false);
    mockExecFileSync.mockImplementation(() => {
      throw new Error('Build failed');
    });

    const plugin = cesdkLocal();

    expect(() => callConfigHook(plugin, {}, { command: 'serve', mode: 'development' }))
      .toThrow(/Failed to build local packages/);
  });

  it('should log verbose messages when verbose option enabled', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    delete process.env.CESDK_USE_LOCAL;

    const plugin = cesdkLocal({ verbose: true });
    callConfigHook(plugin, {}, { command: 'serve', mode: 'development' });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Using published packages')
    );

    consoleSpy.mockRestore();
  });
});
