import _terser from '@rollup/plugin-terser'
import _typescript from '@rollup/plugin-typescript'
import { globSync } from 'glob'
import type { RollupOptions } from 'rollup'

// NOTE: workaround until this PR is merged: https://github.com/rollup/plugins/pull/1578
const terser = _terser as unknown as typeof _terser.default
const typescript = _typescript as unknown as typeof _typescript.default

const entryPaths = globSync('src/**/main.ts')
const configs: RollupOptions[] = entryPaths.map(entryPath => ({
  input: entryPath,
  output: {
    file: entryPath.replace(/^src\//, 'dist/').replace(/\/(.+)\/main\.ts$/, '/$1.min.js'),
    format: 'iife'
  },
  plugins: [
    typescript(),
    terser({
      format: {
        comments: false,
      },
      compress: true,
      mangle: true,
    }),
    {
      name: 'bookmarklet-wrapper',
      renderChunk(code) {
        const fixedCode = code.replace(/^!function/, 'function')
        return {
          code: `javascript:void ${fixedCode}`,
          map: null
        }
      }
    }
  ]
}))

export default configs
