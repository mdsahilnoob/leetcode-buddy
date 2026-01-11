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
    name: 'LeetCode Buddy',
    description: 'Compare LeetCode profiles side-by-side with detailed stats and difficulty breakdown',
    version: '1.0.0',
    action: {
      default_title: 'LeetCode Buddy - Compare Profiles'
    },
    permissions: [
      'sidePanel',
      'tabs',
      'scripting',
      'storage'
    ],
    host_permissions: [
      '*://*.google.com/*',
      'http://localhost/*'
    ]
  }
});
