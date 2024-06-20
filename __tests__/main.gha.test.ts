import * as core from '@actions/core'
import * as main from '../src/main'
import * as path from 'path'
import * as fs from 'fs'
import * as os from 'os'
import {before} from 'node:test'

// Mock the GitHub Actions core library
const warningMock = jest.spyOn(core, 'warning')
const errorMock = jest.spyOn(core, 'error')
const addPathMock = jest.spyOn(core, 'addPath')

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

export function getRunnerTemp(): string {
  let baseLocation: string
  if (process.platform === 'win32') {
    baseLocation = process.env['USERPROFILE'] || 'C:\\'
  } else {
    if (process.platform === 'darwin') {
      baseLocation = '/Users'
    } else {
      baseLocation = '/home'
    }
  }

  return path.join(
    baseLocation,
    os.userInfo().username,
    'msstorecli_runner_temp'
  )
}

describe('action', () => {
  let runnerTemp: string | undefined = undefined
  beforeEach(() => {
    jest.clearAllMocks()
  })
  beforeAll(() => {
    if (!process.env.RUNNER_TEMP) {
      // This is only for debugging purposes
      runnerTemp = getRunnerTemp()
      process.env.RUNNER_TEMP = runnerTemp
    }
  })
  afterAll(() => {
    if (runnerTemp) {
      fs.rmSync(runnerTemp, {recursive: true, force: true})
    }
  })

  it('should have added msstorecli to path', async () => {
    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(warningMock).not.toHaveBeenCalled()
    expect(errorMock).not.toHaveBeenCalled()
    expect(addPathMock).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('msstorecli')
    )
  }, 30000)
})
