import { defineConfig } from 'wxt';

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
      'storage'
    ],
    host_permissions: [
      'http://localhost/*'
    ],
    browser_specific_settings: {
      gecko: {
        id: 'leetcode-buddy@example.com',
        strict_min_version: '142.0'
      }
    }
  }
});
