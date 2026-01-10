import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  srcDir: 'src',
  modulesDir: "wxt-modules",
  outDir: "dist",
  publicDir: "static",
  entrypointsDir: "entrypoints",
  manifest: {
    action: {}
  }
});
