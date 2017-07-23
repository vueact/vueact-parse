const babylon = require('babylon')
const traverse = require('babel-traverse').default
const t = require('babel-types')

module.exports = source => {
  const ast = babylon.parse(source, {
    sourceType: 'module',
    plugins: [
      'jsx'
    ]
  })

  const allDependencies = {}
  const usedInJsx = {}
  const usedDependencies = {}

  traverse(ast, {
    ImportDeclaration(path) {
      let defaultExportIdentifier = null
      path.get('specifiers').forEach(path => {
        if (t.isImportDefaultSpecifier(path)) {
          defaultExportIdentifier = path.node.local.name
        }
      })
      if (defaultExportIdentifier !== null) {
        allDependencies[defaultExportIdentifier] = path.node.source.value
      }
    },

    JSXOpeningElement(path) {
      const name = path.get('name')
      if (t.isJSXIdentifier(name)) {
        usedInJsx[name.node.name] = true
      }
    }
  })

  Object.keys(allDependencies).forEach(dependency => {
    if (usedInJsx[dependency]) {
      usedDependencies[dependency] = allDependencies[dependency]
    }
  })

  return usedDependencies
}
