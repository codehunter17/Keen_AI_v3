# Keen Foundry — E2B Custom Template

Foundry's job is to execute **untrusted, AI-authored Python** for data analysis and ML training. The host server never sees this code; it runs entirely inside an isolated E2B microVM, produces an artifact (`.onnx` or `.pkl`) and metrics JSON, and self-terminates.

Cold-starting a fresh E2B sandbox and `pip install`ing scikit-learn / pandas / xgboost / onnx every run wastes ~60 seconds. Solution: a custom **base template** with everything pre-installed.

## Prerequisites

```bash
npm i -g @e2b/cli
e2b auth login
```

You'll need `E2B_API_KEY` in your Vercel env vars later. Get it from https://e2b.dev/dashboard.

## Files in this folder

Two files alongside this README define the template:

- `e2b.Dockerfile` — base image + pre-installed ML packages
- `e2b.toml` — template metadata (template name, CPU, memory)

## Building the template

From `my-app/keen/sandbox/`:

```bash
e2b template build --name keen-ml-foundry
```

The CLI uploads the Dockerfile, builds the image on E2B's infrastructure, and prints a **template ID**. Copy that ID into your env:

```
E2B_FOUNDRY_TEMPLATE=<template-id-from-build-output>
```

## What's inside the template

- Python 3.11
- `scikit-learn==1.5.*` — classical ML
- `xgboost==2.1.*` — gradient boosting
- `pandas==2.2.*` + `numpy==2.*` — data wrangling
- `scipy==1.14.*` — stats
- `onnx==1.17.*` + `skl2onnx==1.17.*` — export sklearn models to ONNX
- `joblib==1.4.*` — pickle pipelines
- Pre-warmed import cache so the first `import sklearn` is sub-second

## What's NOT inside

- No SSH server, no shell tools beyond `bash`, no `curl`/`wget` baked in
- No host credentials. The sandbox has **zero environment variables** by default — Foundry passes only what's needed for the specific job (e.g. a presigned S3 URL for the dataset, never AWS keys)
- No network egress to anything but the E2B-provided endpoint that returns artifacts back to Keen

## How Keen invokes a sandbox

`keen/sandbox/e2b.ts` (TBD in next build batch) will:

1. Spawn a sandbox from `E2B_FOUNDRY_TEMPLATE`
2. Upload the AI-authored script + the dataset (signed URL)
3. Run with a 5-minute hard timeout
4. Download artifacts: `model.onnx`, `metrics.json`, `stderr.log`
5. Persist artifact URL + metrics into `keen_model_registry`
6. Kill the sandbox

Even if the script tries to read environment variables, write to host paths, or open arbitrary sockets, it can't — those don't exist inside the microVM.

## Rebuilding

When you upgrade package versions, re-run `e2b template build --name keen-ml-foundry`. The template ID is stable across rebuilds.
