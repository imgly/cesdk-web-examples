import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { parseOverrides, validateBuildArtifacts, cesdkLocal } from './vite-config-cesdk-local';
import * as fs from 'fs';
import * as path from 'path';

// Mock fs module
vi.mock('fs', () => ({
  existsSync: vi.fn()
}));

describe('parseOverrides', () => {
  it('should return empty set for undefined', () => {
    expect(parseOverrides(undefined)).toEqual(new Set());
  });

  it('should parse "true" as all packages', () => {
    expect(parseOverrides('true')).toEqual(new Set(['cesdk', 'engine']));
  });

  it('should parse "True" (case insensitive) as all packages', () => {
    expect(parseOverrides('True')).toEqual(new Set(['cesdk', 'engine']));
  });

  it('should parse "1" as all packages', () => {
    expect(parseOverrides('1')).toEqual(new Set(['cesdk', 'engine']));
  });

  it('should parse "all" as all packages', () => {
    expect(parseOverrides('all')).toEqual(new Set(['cesdk', 'engine']));
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
    expect(parseOverrides(' true ')).toEqual(new Set(['cesdk', 'engine']));
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

  it('should throw if cesdk build missing', () => {
    const mockExistsSync = vi.mocked(fs.existsSync);
    mockExistsSync.mockReturnValue(false);

    expect(() => validateBuildArtifacts(new Set(['cesdk']), '/fake/path'))
      .toThrow(/cesdk_web package not built/);
  });

  it('should throw if engine build missing', () => {
    const mockExistsSync = vi.mocked(fs.existsSync);
    mockExistsSync.mockReturnValue(false);

    expect(() => validateBuildArtifacts(new Set(['engine']), '/fake/path'))
      .toThrow(/js_web package not built/);
  });

  it('should throw with both error messages if both builds missing', () => {
    const mockExistsSync = vi.mocked(fs.existsSync);
    mockExistsSync.mockReturnValue(false);

    expect(() => validateBuildArtifacts(new Set(['cesdk', 'engine']), '/fake/path'))
      .toThrow(/cesdk_web package not built[\s\S]*js_web package not built/);
  });

  it('should pass if cesdk build exists', () => {
    const mockExistsSync = vi.mocked(fs.existsSync);
    mockExistsSync.mockReturnValue(true);

    expect(() => validateBuildArtifacts(new Set(['cesdk']), '/fake/path'))
      .not.toThrow();
  });

  it('should pass if engine build exists', () => {
    const mockExistsSync = vi.mocked(fs.existsSync);
    mockExistsSync.mockReturnValue(true);

    expect(() => validateBuildArtifacts(new Set(['engine']), '/fake/path'))
      .not.toThrow();
  });

  it('should pass if both builds exist', () => {
    const mockExistsSync = vi.mocked(fs.existsSync);
    mockExistsSync.mockReturnValue(true);

    expect(() => validateBuildArtifacts(new Set(['cesdk', 'engine']), '/fake/path'))
      .not.toThrow();
  });

  it('should not check builds if no overrides', () => {
    const mockExistsSync = vi.mocked(fs.existsSync);
    mockExistsSync.mockReturnValue(false);

    expect(() => validateBuildArtifacts(new Set(), '/fake/path'))
      .not.toThrow();
    expect(mockExistsSync).not.toHaveBeenCalled();
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

  it('should not apply aliases in build mode', () => {
    process.env.CESDK_USE_LOCAL = 'true';
    const mockExistsSync = vi.mocked(fs.existsSync);
    mockExistsSync.mockReturnValue(true);

    const plugin = cesdkLocal();
    const config = plugin.config?.({}, { command: 'build' });

    expect(config?.resolve?.alias).toBeUndefined();
  });

  it('should warn in build mode when env var set', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    process.env.CESDK_USE_LOCAL = 'true';

    const plugin = cesdkLocal();
    plugin.config?.({}, { command: 'build' });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('CESDK_USE_LOCAL is set but building')
    );

    consoleSpy.mockRestore();
  });

  it('should apply cesdk alias in dev mode', () => {
    process.env.CESDK_USE_LOCAL = 'cesdk';
    const mockExistsSync = vi.mocked(fs.existsSync);
    mockExistsSync.mockReturnValue(true);

    const plugin = cesdkLocal();
    const config = plugin.config?.({}, { command: 'serve' });

    expect(config?.resolve?.alias?.['@cesdk/cesdk-js']).toContain('cesdk_web/build');
  });

  it('should apply engine alias in dev mode', () => {
    process.env.CESDK_USE_LOCAL = 'engine';
    const mockExistsSync = vi.mocked(fs.existsSync);
    mockExistsSync.mockReturnValue(true);

    const plugin = cesdkLocal();
    const config = plugin.config?.({}, { command: 'serve' });

    expect(config?.resolve?.alias?.['@cesdk/engine']).toContain('js_web/build');
  });

  it('should apply both aliases when using "true"', () => {
    process.env.CESDK_USE_LOCAL = 'true';
    const mockExistsSync = vi.mocked(fs.existsSync);
    mockExistsSync.mockReturnValue(true);

    const plugin = cesdkLocal();
    const config = plugin.config?.({}, { command: 'serve' });

    expect(config?.resolve?.alias?.['@cesdk/cesdk-js']).toContain('cesdk_web/build');
    expect(config?.resolve?.alias?.['@cesdk/engine']).toContain('js_web/build');
  });

  it('should not apply aliases when env var not set', () => {
    delete process.env.CESDK_USE_LOCAL;

    const plugin = cesdkLocal();
    const config = plugin.config?.({}, { command: 'serve' });

    expect(config?.resolve?.alias?.['@cesdk/cesdk-js']).toBeUndefined();
    expect(config?.resolve?.alias?.['@cesdk/engine']).toBeUndefined();
  });

  it('should expose env var to client code', () => {
    process.env.CESDK_USE_LOCAL = 'cesdk';
    const mockExistsSync = vi.mocked(fs.existsSync);
    mockExistsSync.mockReturnValue(true);

    const plugin = cesdkLocal();
    const config = plugin.config?.({}, { command: 'serve' });

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
    plugin.configureServer?.(mockServer as any);

    expect(mockServer.watcher.add).toHaveBeenCalledTimes(2);
    expect(mockServer.watcher.add).toHaveBeenCalledWith(
      expect.stringContaining('cesdk_web/build')
    );
    expect(mockServer.watcher.add).toHaveBeenCalledWith(
      expect.stringContaining('js_web/build')
    );
  });

  it('should not add watchers when no overrides', () => {
    delete process.env.CESDK_USE_LOCAL;

    const plugin = cesdkLocal();
    const mockServer = { watcher: { add: vi.fn() } };
    plugin.configureServer?.(mockServer as any);

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
    plugin.configureServer?.(mockServer as any);

    expect(mockServer.watcher.add).toHaveBeenCalledTimes(1);
    expect(mockServer.watcher.add).toHaveBeenCalledWith(
      expect.stringContaining('cesdk_web/build')
    );
  });

  it('should throw if build artifacts missing in dev mode', () => {
    process.env.CESDK_USE_LOCAL = 'true';
    const mockExistsSync = vi.mocked(fs.existsSync);
    mockExistsSync.mockReturnValue(false);

    const plugin = cesdkLocal();

    expect(() => plugin.config?.({}, { command: 'serve' }))
      .toThrow(/Local package builds missing/);
  });

  it('should log verbose messages when verbose option enabled', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    delete process.env.CESDK_USE_LOCAL;

    const plugin = cesdkLocal({ verbose: true });
    plugin.config?.({}, { command: 'serve' });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Using published packages')
    );

    consoleSpy.mockRestore();
  });
});
