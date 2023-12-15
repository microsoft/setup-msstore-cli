import * as path from 'path'
import * as assert from 'assert'
import * as ttm from 'azure-pipelines-task-lib/mock-test'
import {test} from '@jest/globals'

test('Sample task tests', async function () {
  var testPath = path.join(__dirname, '..', 'lib', '__tests__', 'success.js')
  let taskJsonPath = path.join(
    __dirname,
    '..',
    'setup-msstore-cli-task',
    'task.json'
  )
  let tr: ttm.MockTestRunner = new ttm.MockTestRunner()
  await tr.LoadAsync(testPath, taskJsonPath)

  await tr.runAsync()
  console.log(tr.succeeded)
  assert.equal(tr.succeeded, true, 'should have succeeded')
  assert.equal(tr.warningIssues.length, 0, 'should have no warnings')
  assert.equal(tr.errorIssues.length, 0, 'should have no errors')
  console.log(tr.stdout)
  assert.equal(
    tr.stdOutContained('##vso[task.prependpath]'),
    true,
    'should have prepended path'
  )
  // find '##vso[task.prependpath]' line
  var line = tr.stdout
    .split('\n')
    .find(line => line.trim().startsWith('##vso[task.prependpath]'))
  assert.notEqual(line, undefined, 'should have prepended path')
  if (!line) {
    assert.fail('should have prepended path')
  } else {
    // extract path from line
    var pathInLine = line.split(']')[1].trim()
    assert.equal(
      pathInLine.indexOf('msstorecli') > 0,
      true,
      'should have prepended msstorecli'
    )
  }
}, 60000)
