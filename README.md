![Hero image showing the configuration abilities of CE.SDK](https://img.ly/static/cesdk_release_header.png)

# CreativeEditor SDK - Web Examples

The CreativeEditor SDK (**CE.SDK**) for Web is a fully customizable, simple-to-use design editor.

Seamlessly integrate it into any Web app with just a few lines of code. The editor combines the best of layout, typography and photo editing. **CE.SDK** also facilitates both template creation and adaption workflows, also featuring constraints and text placeholders for database automations.

Visit our [website](https://img.ly) for more tutorials on how to integrate and customize the editor for your specific use-case.

## Documentation

The full documentation of the CreativeEditor SDK can be found at
[https://img.ly/docs/cesdk/](https://img.ly/docs/cesdk/).

## Asset hosting (internal note)

Several kits load runtime assets (scene archives, template previews, mockup
images, etc.) from a shared CDN. The asset tree lives in
[`packages/cesdk-web-examples-data/`](../../packages/cesdk-web-examples-data/README.md)
and is uploaded to `staticimgly.com` separately from the kit publish pipeline.

Each affected kit bakes a single exported constant — there is no import of
the data package and no helper function:
`DEMO_ASSETS_BASE_URL = https://staticimgly.com/imgly/cesdk-web-examples-data/<version>/<kit>`.
Call sites interpolate it directly. The `VITE_DEMO_ASSETS_BASE_URL` env
override is public: it ships in each kit's `.env.example`, so customers
self-host by setting it in `.env` (or by editing the fallback constant).

During development nothing needs configuring: `pnpm dev` (via
`cesdk-js-dev`/`cesdk-engine-dev`) starts the shared **imgly-local-cdn**
server (see `packages/dev-server-core/README.md`), which serves
`packages/cesdk-web-examples-data/data/` alongside the engine assets and
injects `VITE_DEMO_ASSETS_BASE_URL` to point the kit at its own data
folder. Files that are unmaterialized LFS pointer stubs are transparently
proxied to the released CDN; to edit assets locally, materialize them
first:

```sh
git lfs pull -X '' -I "packages/cesdk-web-examples-data/data/**"
```

`pnpm --filter @imgly/cesdk-web-examples-data check` verifies every kit's
baked URL matches the data package version. See the data package's README
for the full deployment/dev workflow.

## License

The CreativeEditor SDK is a commercial product. To use it you need to unlock the SDK with a license file. You can purchase a license at https://img.ly/pricing.
