const path = require('path')
const parseFile = require('./parse-file')

module.exports = async file => {
  const tree = {
    entry: file,
    dependencies: [{
      file,
      resolved: false
    }],
    components: {}
  }

  while (tree.dependencies.filter(dependency => !dependency.resolved).length) {
    const dep = tree.dependencies.filter(dependency => !dependency.resolved)[0]
    const file = await parseFile(dep.file)

    Object.keys(file.dependencies).forEach(dependency => {
      const filePath = path.join(path.dirname(dep.file), dependency)
      if (tree.dependencies.find(dependency => dependency.file === filePath)) {
        return
      }

      tree.dependencies.push({
        file: path.join(path.dirname(dep.file), dependency),
        resolved: false
      })
    })
    tree.components[dep.file] = file
    dep.resolved = true
  }

  delete tree.dependencies

  return tree
}
