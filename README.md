# isotope Documentation

This repository contains markdown documentation for isotope, which is used to build a static web
site for end users. The site is built using [VitePress](https://vitepress.dev).

To build the documentation, you must have nodejs v18 or later plus NPM. To initialize the build
environment, run:

```npm install```

To write documentation and see a live preview in-browser:

```npm run docs:dev```

To build the static site for deployment, run:

```npm run docs:build```

The static content will be written to `.vitepress/dist` and can be deployed via any file copy method.
