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

module.exports = async importFileName => {
  let fileName = /\.js?$/.test(importFileName) ? importFileName : `${importFileName}.js`
  let source = await readFile(fileName)
  const dependencies = getDependencies(source)
  return {
    fileName,
    source,
    dependencies
  }
}
