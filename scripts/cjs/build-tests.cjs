const { buildSync } = require('esbuild');
const { sync: globSync } = require('glob');
const path = require('path');
const fs = require('fs');

const files = globSync('test/**/*.ts');
if (!files.length) {
  console.log('No test files found');
  process.exit(0);
}

for (const file of files) {
  const rel = path.relative('test', file);
  const outPath = path.join('build-tests', rel).replace(/\.ts$/, '.js');
  const outDir = path.dirname(outPath);
  fs.mkdirSync(outDir, { recursive: true });
  console.log(`Building ${file} -> ${outPath}`);
  buildSync({
    entryPoints: [file],
    outfile: outPath,
    bundle: false,
    platform: 'node',
    format: 'cjs',
    target: ['node18'],
    sourcemap: false,
    logLevel: 'info',
  });
}

console.log('build-tests complete');
