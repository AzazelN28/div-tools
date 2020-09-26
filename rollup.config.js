import babel from '@rollup/plugin-babel'
import strip from '@rollup/plugin-strip'
import { terser } from 'rollup-plugin-terser'

const name = 'div'

export default {
  plugins: [
    strip(),
    babel({
      babelHelpers: 'runtime'
    })
  ],
  input: 'src/index.js',
  output: [{
    name,
    file: 'dist/lib.js',
    format: 'umd'
  }, {
    name,
    file: 'dist/lib.min.js',
    format: 'umd',
    plugins: [terser()]
  }, {
    file: 'dist/lib.mjs',
    format: 'esm'
  }, {
    file: 'dist/lib.min.mjs',
    format: 'esm',
    plugins: [terser()]
  }]
}
