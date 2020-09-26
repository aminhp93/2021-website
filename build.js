const path = require('path')
const fs = require('fs')
const { fusebox } = require('fuse-box')
const { ClassConstructorPropertyTransformer } = require(
  'fuse-box/compiler/transformers/ts/ClassConstructorPropertyTransformer'
)
const { CommonTSfeaturesTransformer } = require(
  'fuse-box/compiler/transformers/ts/CommonTSfeaturesTransformer'
)
const {
  HoistES6ImportTransformer,
  DestructuringExportTransformer,
  NamedDefaultImportTransformer
} = require('./lib/transformers');

const head = fs.readFileSync('.git/HEAD').toString().trim().replace('ref: ', '')
const hash = head.startsWith('ref')
      ? fs.readFileSync(`.git/${head}`).toString().trim()
      : head

const production = process.env.NODE_ENV === 'production'

const env = {
  NODE_ENV: process.env.NODE_ENV,
  ENV: process.env.ENV,
  VERSION: process.env.npm_package_version,
  BUILD: `${head}:${hash}`
}

console.log(env)

const bundle = fusebox({
  target: 'browser',

  entry: 'src/index.tsx',
  // entry: 'src/test.tsx',

  env: env,

  /**
   * Workaround the fact that we're using JSX with `.js` extension,
   * which doesn't play nice with Fusebox. What we're doing here is
   * to manually add some TS-specific transformers and override their
   * `target` property so that they are also applicable to JS files.
   */
  compilerOptions: {
    jsParser: {
      nodeModules: 'meriyah',
      project: 'ts'
    },
    transformers: [{
      name: 'ClassConstructorPropertyTransformer',
      transformer: () => {
        const transformer = ClassConstructorPropertyTransformer()
        transformer.target = null
        return transformer
      }
    }, {
      name: 'CommonTSfeaturesTransformer',
      transformer: () => {
        const transformer = CommonTSfeaturesTransformer()
        transformer.target = null
        return transformer
      }
    }, {
      name: 'NamedDefaultImportTransformer',
      transformer: () => new NamedDefaultImportTransformer()
    }, {
      name: 'HoistES6ImportTransformer',
      transformer: () => new HoistES6ImportTransformer()
    }, {
      name: 'DestructuringExportTransformer',
      transformer: () => new DestructuringExportTransformer()
    }]
  },

  alias: {
    'classnames': 'clsx',
    '^indexof$': 'component-indexof',
    './runtimeConfig$': './runtimeConfig.browser',
  },

  webIndex: {
    template: 'src/index.html'
  },

  uglify: production,

  sourceMap: true,

  turboMode: true,

  stylesheet: {
    macros: {
      '~': path.resolve(__dirname, './node_modules/'),
    },
  },

  resources: {
    resourcePublicRoot: '/static',
    resourceFolder: 'static'
  },

  link: {
    resourcePublicRoot: '/static',
  },

  devServer: !production && {
    httpServer: {
      port: 3000
    },

    proxy: [{
      path: '/api',
      options: {
        target: 'http://localhost:8000'
      }
    }]
  },

  // logging: {
  //   level: 'verbose'
  // }
});

production ? bundle.runProd() : bundle.runDev();
