import { Config } from 'bili'

const config: Config = {
  input: 'src/index.ts',
  output: {
    moduleName: 'VuePortableText',
    format: ['cjs', 'esm', 'umd'],
  },
  plugins: {
    typescript2: {
      // Override the config in `tsconfig.json`
      tsconfigOverride: {
        include: ['src'],
      },
    },
  },
}

export default config
