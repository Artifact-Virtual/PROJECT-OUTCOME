import { register } from 'ts-node/esm';
register();
import Mocha from 'mocha';
import { globSync } from 'glob';
import path from 'path';

const mocha = new Mocha({
  timeout: 40000,
  ui: 'bdd',
});

const files = globSync('test/**/*.test.ts');
for (const f of files) {
  mocha.addFile(path.resolve(f));
}

mocha.run((failures) => {
  process.exitCode = failures ? 1 : 0;
});
