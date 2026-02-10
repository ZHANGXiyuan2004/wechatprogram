#!/usr/bin/env node
/*
 * vite-plugin-uni old alpha versions require ../../../uni-cli-shared/dist
 * This shim links unscoped uni-cli-shared to @dcloudio/uni-cli-shared
 * inside the pnpm package folder so build/dev can resolve the module.
 */
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '../../..');
const pnpmDir = path.join(repoRoot, 'node_modules/.pnpm');
if (!fs.existsSync(pnpmDir)) {
  process.exit(0);
}

let sharedDir = '';
try {
  const sharedPkg = require.resolve('@dcloudio/uni-cli-shared/package.json', {
    paths: [path.join(repoRoot, 'apps/mini')]
  });
  sharedDir = path.dirname(sharedPkg);
} catch (_err) {
  process.exit(0);
}

const entries = fs.readdirSync(pnpmDir);
for (const entry of entries) {
  if (!entry.startsWith('@dcloudio+vite-plugin-uni@')) {
    continue;
  }

  const nodeModulesDir = path.join(pnpmDir, entry, 'node_modules');
  const pluginRoot = path.join(nodeModulesDir, '@dcloudio', 'vite-plugin-uni');
  const scopedNamespace = path.join(nodeModulesDir, '@dcloudio');
  const scopedLink = path.join(scopedNamespace, 'uni-cli-shared');
  const unscoped = path.join(nodeModulesDir, 'uni-cli-shared');

  if (!fs.existsSync(scopedNamespace)) {
    fs.mkdirSync(scopedNamespace, { recursive: true });
  }

  if (!fs.existsSync(scopedLink)) {
    try {
      fs.symlinkSync(sharedDir, scopedLink, 'dir');
      console.log(`[mini-compat] linked ${scopedLink} -> ${sharedDir}`);
    } catch (err) {
      console.warn(`[mini-compat] failed to link scoped path in ${entry}:`, err.message);
    }
  }

  if (!fs.existsSync(unscoped)) {
    try {
      fs.symlinkSync(sharedDir, unscoped, 'dir');
      console.log(`[mini-compat] linked ${unscoped} -> ${sharedDir}`);
    } catch (err) {
      console.warn(`[mini-compat] failed to link unscoped path in ${entry}:`, err.message);
    }
  }

  // Backfill missing ssr templates expected by old plugin builds.
  const libSsrDir = path.join(pluginRoot, 'lib', 'ssr');
  const defineTemplate = path.join(libSsrDir, 'define.js');
  const entryTemplate = path.join(libSsrDir, 'entry-server.js');
  if (!fs.existsSync(libSsrDir)) {
    fs.mkdirSync(libSsrDir, { recursive: true });
  }
  if (!fs.existsSync(defineTemplate)) {
    fs.writeFileSync(
      defineTemplate,
      "(function(){const d=__DEFINES__;globalThis.__uniSSRDefine=d;globalThis.__uniSSRUnit=__UNIT__;globalThis.__uniSSRUnitRatio=__UNIT_RATIO__;globalThis.__uniSSRUnitPrecision=__UNIT_PRECISION__;})();\\n",
      'utf8'
    );
    console.log(`[mini-compat] created ${defineTemplate}`);
  }
  if (!fs.existsSync(entryTemplate)) {
    fs.writeFileSync(
      entryTemplate,
      "import { createSSRApp } from 'vue';\\nimport App from '../../App.vue';\\nexport function createApp(){ const app = createSSRApp(App); return { app }; }\\n",
      'utf8'
    );
    console.log(`[mini-compat] created ${entryTemplate}`);
  }
}
