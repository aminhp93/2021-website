const partition = require('lodash/partition');
const helpers = require('fuse-box/compiler/helpers/helpers')
const bundleRuntimeCore = require('fuse-box/bundleRuntime/bundleRuntimeCore')

/**
 * Transformer to hoist import statements to the top of the file.
 * ES6 allows import statments to be placed at the bottom of the file and will still
 * works correctly. However, Fusebox transforms those import statements into
 * `var`, so they will be comes undefined and cause errors. This transformer
 * hoists (moves) all those import statement to the top of the file.
 *
 * Fixes: react-virtualized/dist/es/ArrowKeyStepper/ArrowKeyStepper.js
 *   which put import 'prop-types' at the bottom.
 *
 * To be fair, this isn't a Fusebox specific problem. react-virtualized is also
 * breaking the official TypeScript compiler and needed a patch too.
 * Ref: https://github.com/microsoft/TypeScript/pull/37093.
 */
class HoistES6ImportTransformer {
  constructor() {
    this.target = {
      type: 'js'
    }
  }

  commonVisitors(_props) {
    const isImportDeclaration = node => {
      return node.type === 'ImportDeclaration'
    }

    return {
      onProgramBody: (schema) => {
        const { context, parent, node } = schema

        // Encounter a new module, move all import statements to the top
        if (node === parent.body[0]) {
          const imports = parent.body.filter(isImportDeclaration)
          schema.bodyPrepend(imports)
        }

        // Since we already move all the import statements, don't need to render
        // them any more. Can't use schema.remove() as we need to retain them
        // for dependency tracking purpose
        if (isImportDeclaration(node)) {
          return context.onComplete(() => {
            schema.remove()
          })
        }
      }
    }
  }
}

exports.HoistES6ImportTransformer = HoistES6ImportTransformer;


/**
 * Fix exporting object destructuring, often seen in Redux slices.
 *
 * Before:
 * export { fetchUserProfile } = slice.actions
 *
 * After:
 * const { fetchUserProfile } = slice.actions
 * module.exports.fetchUserProfile = fetchUserProfile
 */
class DestructuringExportTransformer {
  commonVisitors(_props) {
    return {
      onProgramBody: (schema) => {
        const { context, node } = schema

        // Don't ask me about this, it's the result of a few hours trial-and-error
        const isObjectPatternExport = node.type === 'ExportNamedDeclaration'
              && node.specifiers.length === 0
              && node.declaration.declarations
              && node.declaration.declarations.length > 0
              && node.declaration.declarations[0].id.type === 'ObjectPattern';

        if (isObjectPatternExport) {
          const exported = node.declaration.declarations[0].id.properties
                .map(prop => helpers.createExports({
                  exportsKey: context.moduleExportsName,
                  exportsVariableName: prop.value.name,
                  property: prop.key
                }))
          schema.replace([node.declaration].concat(exported))
        }
      }
    }
  }
}

exports.DestructuringExportTransformer = DestructuringExportTransformer;


/**
 * Fix: mini-store/esm/connect.js - a.k.a clicking "three-dot" crashing.
 *
 * import { default as React, Component } from 'react'
 *
 * React.default.createElement -> wrong
 */
class NamedDefaultImportTransformer {
  commonVisitors(_props) {
    return {
      onProgramBody: (schema) => {
        const { context, node } = schema
        if (node.type === 'ImportDeclaration') {
          const [defaults, rests] = partition(node.specifiers, specifier =>
            specifier.type === 'ImportSpecifier' && specifier.imported.name === 'default'
          )

          // The import statement includes both the named default import and
          // other named imports
          if (defaults.length > 0 && rests.length > 0) {
            // Retain the other named imports
            node.specifiers = rests

            // Create additional statements for the default import.
            // It is quite involved due to esModuleInterop.
            const variable = context.getModuleName(node.source.value)
            const injectDefaultInterop = variable + 'd'

            context.coreReplacements[defaults[0].local.name] = {
              first: injectDefaultInterop,
              second: 'default'
            }

            const require = helpers.createRequireStatement(
              node.source.value, node.specifiers.length && variable
            )
            const defaultInterop = helpers.createEsModuleDefaultInterop({
              helperObjectName: bundleRuntimeCore.BUNDLE_RUNTIME_NAMES.GLOBAL_OBJ,
              helperObjectProperty: bundleRuntimeCore.BUNDLE_RUNTIME_NAMES.INTEROP_REQUIRE_DEFAULT_FUNCTION,
              targetIdentifierName: variable,
              variableName: injectDefaultInterop,
            });

            schema.replace([node, require.statement, defaultInterop])
          }
        }
      }
    }
  }
}

exports.NamedDefaultImportTransformer = NamedDefaultImportTransformer
