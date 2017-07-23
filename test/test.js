import test from 'ava'
import path from 'path'
import parser from '../index'

test('default behaviour', async t => {
  const tree = await parser(path.join(__dirname, 'test1', 'index.js'))

  t.snapshot(tree)
})
