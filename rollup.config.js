import buble from 'rollup-plugin-buble';
import { uglify } from 'rollup-plugin-uglify';
import { libName } from './package.json';

const plugins = [
  buble()
];

export default [
  {
    input: 'src/index.js',
    output: {
      file: `dist/${libName}.js`,
      format: 'umd',
      globals: {
        'phina.js': 'phina',
      },
    },
    external: ['phina.js'],
    plugins: plugins,
  },

  // min ver.
  {
    input: 'src/index.js',
    output: {
      file: `dist/${libName}.min.js`,
      format: 'umd',
      globals: {
        'phina.js': 'phina',
      },
    },
    external: ['phina.js'],
    plugins: plugins.concat([uglify()]),
  },
]