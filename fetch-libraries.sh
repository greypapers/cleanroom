#!/bin/sh

# Create the lib directory if it doesn't exist
mkdir -p lib

curl -fsSL https://raw.githubusercontent.com/mujahidfa/preact-htm-signals-standalone/refs/heads/main/dist/standalone.js -o lib/standalone.js
curl -fsSL https://unpkg.com/d3@5.7.0/dist/d3.min.js -o lib/d3.min.js

# curl -fsSL https://esbuild.github.io/dl/v0.25.0 | sh
# ./esbuild src/app.js --bundle --minify --outfile=dist/bundle.js --watch

