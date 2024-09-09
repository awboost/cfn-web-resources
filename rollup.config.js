import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import builtin from 'builtin-modules';
import sourcemaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';

const DEBUGGING = !!process.env.DEBUGGING;
const external = [...builtin];

/** @type {import('rollup').RollupOptions} */
export default {
  input: 'lib/index.js',

  output: {
    file: 'index.mjs',
    format: 'esm',
    sourcemap: true,
    inlineDynamicImports: true,
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
  ].filter(Boolean),

  external: (id) => external.includes(id),
};
