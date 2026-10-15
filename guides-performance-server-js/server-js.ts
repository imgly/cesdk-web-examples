/**
 * CE.SDK Server Guide: Improve Performance
 *
 * Demonstrates caching and limiting concurrent connections for the
 * engine's network requests:
 * - Installing an undici dispatcher with a per-origin connection limit
 * - Caching downloaded assets on disk with a SQLite cache store
 * - Counting the requests that reach the network with diagnostics_channel
 */
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import diagnostics_channel from 'node:diagnostics_channel';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Agent, cacheStores, interceptors, setGlobalDispatcher } from 'undici';

const ASSET_ORIGIN = 'https://img.ly';

setGlobalDispatcher(
  new Agent({ connections: 2, allowH2: false }).compose(
    interceptors.cache({
      store: new cacheStores.SqliteCacheStore({
        location: join(tmpdir(), 'cesdk-fetch-cache.db')
      }),
      cacheByDefault: 24 * 60 * 60 * 1000,
      origins: [ASSET_ORIGIN]
    })
  )
);

config();

const IMAGE_URLS = [1, 2, 3, 4, 5, 6].map(
  (index) => `${ASSET_ORIGIN}/static/ubq_samples/sample_${index}.jpg`
);

const stats = { sent: 0, active: 0, maxActive: 0 };
const onTheWire = new WeakSet<object>();

diagnostics_channel.subscribe('undici:client:sendHeaders', (message) => {
  const { request } = message as { request: { origin: string } };
  if (request.origin !== ASSET_ORIGIN) return;
  onTheWire.add(request);
  stats.sent += 1;
  stats.active += 1;
  stats.maxActive = Math.max(stats.maxActive, stats.active);
});

const onFinished = (message: unknown) => {
  const { request } = message as { request: object };
  if (!onTheWire.delete(request)) return;
  stats.active -= 1;
};
diagnostics_channel.subscribe('undici:request:trailers', onFinished);
diagnostics_channel.subscribe('undici:request:error', onFinished);

async function renderDesign(label: string): Promise<void> {
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE,
  });

  try {
    const sentBefore = stats.sent;
    stats.maxActive = 0;

    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);
    engine.block.setWidth(page, 900);
    engine.block.setHeight(page, 600);

    IMAGE_URLS.forEach((url, index) => {
      const block = engine.block.create('graphic');
      engine.block.setShape(block, engine.block.createShape('rect'));
      const fill = engine.block.createFill('image');
      engine.block.setString(fill, 'fill/image/imageFileURI', url);
      engine.block.setFill(block, fill);
      engine.block.setPositionX(block, (index % 3) * 300);
      engine.block.setPositionY(block, Math.floor(index / 3) * 300);
      engine.block.setWidth(block, 300);
      engine.block.setHeight(block, 300);
      engine.block.appendChild(page, block);
    });

    await engine.block.export(page);

    console.log(
      `${label}: ${stats.sent - sentBefore} requests sent for ` +
        `${IMAGE_URLS.length} images, at most ${stats.maxActive} at a time`
    );
  } finally {
    engine.dispose();
  }
}

await renderDesign('First render');
await renderDesign('Second render');
