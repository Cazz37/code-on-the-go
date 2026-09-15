import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { transformWithEsbuild } from 'vite';
import {
  compileBlueprint,
  inferBlueprint,
  validateBlueprint
} from '../src/vibecore/engine.js';

const dashboard = compileBlueprint({
  projectName: 'Pocket Reports',
  brief: 'Build a mobile analytics dashboard with searchable cards, stats, and a table.',
  recipe: 'auto',
  target: 'auto',
  style: 'soft',
  navigation: 'bottom'
});

assert.equal(dashboard.blueprint.recipe.id, 'dashboard');
assert.equal(dashboard.blueprint.target.id, 'react');
assert.ok(dashboard.blueprint.components.includes('stats'));
assert.ok(dashboard.blueprint.components.includes('search'));
assert.ok(dashboard.blueprint.components.includes('table'));
assert.ok(dashboard.files.some((file) => file.path === 'src/App.jsx'));
assert.ok(dashboard.files.some((file) => file.path === 'index.html'));
assert.ok(dashboard.files.some((file) => file.path === 'vite.config.js'));
assert.ok(dashboard.files.some((file) => file.path === 'public/icon.svg'));
assert.ok(dashboard.files.some((file) => file.path === 'preview.html'));
assert.equal(
  dashboard.diagnostics.filter((item) => item.level === 'error').length,
  0
);

const landing = compileBlueprint({
  projectName: 'Aveth Launch',
  brief: 'A static one page marketing site with a contact form.',
  recipe: 'auto',
  target: 'auto',
  style: 'minimal',
  navigation: 'top'
});

assert.equal(landing.blueprint.recipe.id, 'landing');
assert.equal(landing.blueprint.target.id, 'static');
assert.equal(landing.primaryFile, 'index.html');
assert.ok(landing.files.some((file) => file.path === 'styles.css'));
assert.ok(landing.files.some((file) => file.path === 'app.js'));
assert.ok(
  landing.files
    .find((file) => file.path === 'index.html')
    .content.includes('<link rel="stylesheet" href="./styles.css" />')
);

const referenceBlueprint = inferBlueprint({
  projectName: 'Reference Build',
  brief: 'Build a booking app for appointments.',
  palette: ['#123456', '#abcdef'],
  reference: {
    name: 'reference.png',
    width: 1179,
    height: 2556,
    palette: ['#123456', '#abcdef']
  }
});

assert.equal(referenceBlueprint.tokens.colours.primary, '#123456');
assert.deepEqual(referenceBlueprint.reference.palette, ['#123456', '#abcdef']);
assert.ok(
  validateBlueprint(referenceBlueprint).some(
    (item) => item.code === 'REFERENCE' && item.level === 'pass'
  )
);

const first = compileBlueprint({
  projectName: 'Repeatable',
  brief: 'Build a storefront with products and search.',
  target: 'react'
});
const second = compileBlueprint({
  projectName: 'Repeatable',
  brief: 'Build a storefront with products and search.',
  target: 'react'
});

assert.deepEqual(first.blueprint, second.blueprint);
assert.deepEqual(first.files, second.files);
assert.ok(first.previewHtml.includes('min-height: 44px'));
assert.ok(!JSON.stringify(first.files).toLowerCase().includes('openai'));

const generatedApp = dashboard.files.find((file) => file.path === 'src/App.jsx').content;
const transformedApp = await transformWithEsbuild(generatedApp, 'App.jsx', {
  loader: 'jsx',
  jsx: 'automatic'
});
assert.ok(transformedApp.code.includes('visibleCards'));

const verificationRoot = path.join(process.cwd(), 'node_modules', '.cache');
await fs.mkdir(verificationRoot, { recursive: true });
const verificationDirectory = await fs.mkdtemp(
  path.join(verificationRoot, 'vibecore-build-')
);
try {
  await Promise.all(
    dashboard.files.map(async (generatedFile) => {
      const destination = path.join(verificationDirectory, generatedFile.path);
      await fs.mkdir(path.dirname(destination), { recursive: true });
      await fs.writeFile(destination, generatedFile.content);
    })
  );
  const build = spawnSync(
    path.resolve('node_modules/.bin/vite'),
    ['build'],
    {
      cwd: verificationDirectory,
      encoding: 'utf8'
    }
  );
  assert.equal(
    build.status,
    0,
    'Generated React project should build successfully.\n' + build.stdout + build.stderr
  );
} finally {
  await fs.rm(verificationDirectory, { recursive: true, force: true });
}

console.log('VibeCore smoke tests passed');
