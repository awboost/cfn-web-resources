import convert from 'convert-source-map';
import { readFile } from 'fs/promises';
import { dirname, resolve } from 'path';

/** @return {import('rollup').Plugin} */
function sourcemaps() {
  // load pre-existing sourcemaps for inputs, because Rollup still doesn't do
  // this by default and rollup-plugin-sourcemaps isn't maintained anymore
  return {
    name: 'sourcemaps',
    async load(id) {
      // skip modules which have already been resolved by other plugins
      if (id.startsWith('\0')) {
        return null;
      }
      try {
        const code = await readFile(id, 'utf8');
        const map = await convert.fromMapFileSource(code, async (file) => {
          return await readFile(resolve(dirname(id), file), 'utf8');
        });
        return {
          code,
          map: map?.toObject(),
        };
      } catch (err) {
        if (err?.code === 'ENOENT') {
          return null;
        }
        throw err;
      }
    },
  };
}

export default sourcemaps;
