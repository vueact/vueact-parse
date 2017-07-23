const fs = require('fs')
const getDependencies = require('./get-dependencies')

const readFile = fileName =>
  new Promise((resolve, reject) =>
    fs.readFile(fileName, 'utf-8', (err, source) => {
      if (err) {
        return reject(err)
      }
      resolve(source)
    })
  )

module.exports = async fileName => {
  let source
  try {
    source = await readFile(fileName)
  } catch (e) {
    source = await readFile(`${fileName}.js`)
  }
  const dependencies = getDependencies(source)
  return {
    fileName,
    source,
    dependencies
  }
}
