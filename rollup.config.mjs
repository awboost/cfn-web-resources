import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import builtin from 'builtin-modules';
import sourcemaps from './rollup-plugin-sourcemaps.mjs';
import zip from './rollup-plugin-zip.mjs';

const DEBUGGING = !!process.env.DEBUGGING;
const external = [...builtin];

export default [
  'auto-cert',
  'empty-bucket',
  'get-stream-arn',
  'put-object',
  'unpack-asset',
].map(config);

/**
 * @param {string} resource
 * @returns {import('rollup').RollupOptions}
 */
function config(resource) {
  return {
    input: `./lib/${resource}/lambda.js`,

    output: {
      file: 'dist/index.mjs',
      sourcemap: true,
    },

    plugins: [
      resolve({
        exportConditions: ['node'],
      }),
      commonjs(),
      json(),
      sourcemaps(),
      !DEBUGGING &&
        terser({
          output: {
            comments: false,
          },
        }),
      zip({ fileName: `${resource}.zip` }),
    ].filter(Boolean),

    external: (id) => external.includes(id),
  };
}
