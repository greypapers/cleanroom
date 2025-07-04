

# <img src="/Users/mvm/Desktop/LABEL CONCEPT/cleanroom/cleanroom_guy.svg" alt="cleanroom_guy " style="zoom:5%;" />   CLEANROOM.JS 

`2025-04-15 10:55p `

Refactored into an es module format. Increasing parity towards the `standalone` bundle. 

Exploring replacing `esbuild` with `bun`.

Saw this on HN tonight:

https://legacy.reactjs.org/blog/2016/09/28/our-first-50000-stars.html



`2025-02-17  7:43a`

> https://en.wikipedia.org/wiki/Clean-room_design

- Also a reference to on-premises usage...

- Previous effort reverse-engineering React, etc: https://github.com/vmwherez/nonxjs

  - Suggesting `esbuild` and teaching the architect React landed me my first Senior Software Engineer title

- Standalone Preact + Hooks + HTM + Signals: https://github.com/mujahidfa/preact-htm-signals-standalone

- Distaste for JS Churn - no `npm`

- Independent repo for opinionated frontend techniques I've been using with Starlette

- Reverse Engineered JSUtil in 2015. I have an idea of compression and obfuscation.

- 'Clean Room' implementation is somewhat playful, however moving to HTM and ditching `npm` was a departure from the mainstream that kept most of the modern practices

- Many years of experience frustrated with leaky abstractions. Many times going under-the-hood with some framework or implementation was the solution instantly rather than using the exposed API.

- It's 2025. Ryan Dahl disowned Node.js years ago.

TODO:

- [x] Init repo
- [x] Start docs & roadmap
- [x] `git` branching
- [x] `sh` scripts for managing _libraries_ and `esbuild`
- [x] Modern composable components
- [ ] Reimplement `standalone.js` , documenting Preact in the process

#### `esbuild`

```
# build.sh
#!/bin/sh
./esbuild src/app.js --bundle --outfile=dist/bundle.js --watch
```

https://esbuild.github.io/api/#build

#### Bulma CSS

https://bulma.io/documentation/start/installation/

https://bulma.io/documentation/customize/concepts/

## dev server & backend

#### Python

```
python -m http.server 8000
```

> This frontend work lines up with previous and other work with I've done with Starlette and Django, so I often like to mock the backend with simple Python as mental placeholder.

`esbuild` has a dev server option as well, including hot reload, but I don't really care about that.

```
esbuild app.ts --bundle --outdir=dist --serve

 > Local:   http://127.0.0.1:8000/
 > Network: http://192.168.0.1:8000/

127.0.0.1:61302 - "GET /" 200 [1ms]
```

#### notes

- https://www.puruvj.dev/blog/deep-dive-into-preact-source-code
- https://github.com/preactjs/preact/issues/2233 why Preact isn't shipped as a bundled unminified source
- https://github.com/preactjs/preact/blob/main/hooks/src/index.js
- https://github.com/preactjs/preact/blob/main/src/create-element.js
- https://github.com/mathjax/MathJax/issues/951
- https://codepen.io/developit/pen/yxvYXd date picker to reimplement
- https://bulma.io/documentation/start/installation/
- https://github.com/developit/htm/blob/master/src/build.mjs
