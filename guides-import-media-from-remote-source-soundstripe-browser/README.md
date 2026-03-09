# Soundstripe Audio Integration - CE.SDK Guide

This example demonstrates how to integrate Soundstripe's audio library into CE.SDK using the official plugin.

## Features

- Install and configure the Soundstripe plugin
- Add Soundstripe to the audio asset library
- Automatic URI refresh for expired audio links
- Manual URI refresh utility

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Configuration

The example requires a Soundstripe proxy server. Configure it by:

1. Creating a `.env` file with `VITE_SOUNDSTRIPE_PROXY_URL=https://your-proxy-server.example.com`
2. Set up a proxy server as described in [Soundstripe's integration guide](https://docs.soundstripe.com/docs/integrating-soundstripes-content-into-your-application)
