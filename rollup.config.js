import path from 'path'
import ResolvePlugin from '@rollup/plugin-node-resolve'
import TypescriptPlugin from '@rollup/plugin-typescript'
import CommonjsPlugin from '@rollup/plugin-commonjs'
import JsonPlugin from '@rollup/plugin-json'

const __dirname = path.resolve()

//extensions

const extensions = ['.js', '.ts']

//plugins

const resolvePlugin = ResolvePlugin({
  extensions,
})

const commonjsPlugin = CommonjsPlugin()

const jsonPlugin = JsonPlugin()

const tsPlugin = TypescriptPlugin({
  tsconfig: path.resolve(__dirname, './tsconfig.json'),
})

const plugins = [resolvePlugin, commonjsPlugin, tsPlugin, jsonPlugin]

//base config

const baseConfig = {
  input: './src/index.ts',
  external: process.env.BUILD_TYPE === 'test ' ? [] : ['axios', '@otplib/preset-default'],
  plugins,
}

//output type

const outputType = [
  {
    file: './dist/index.js',
    name: 'index',
    format: 'cjs',
  },
  {
    file: './dist/index.mjs',
    name: 'index',
    format: 'esm',
  },
]

//export

export default outputType.map((e) =>
  Object.assign({}, baseConfig, { output: e })
)
