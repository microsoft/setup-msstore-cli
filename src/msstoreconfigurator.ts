import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as exec from '@actions/exec'
import * as io from '@actions/io'
import * as path from 'path'
import * as os from 'os'
import {v4 as uuidv4} from 'uuid'
import * as fs from 'fs-extra'

const Version = 'version'

export function getConfig(): MSStoreCLIConfigurator {
  return new MSStoreCLIConfigurator(core.getInput(Version) || 'latest')
}

export class MSStoreCLIConfigurator {
  version: string

  constructor(version: string) {
    this.version = version
  }

  async configure(): Promise<void> {
    this.validate()

    let platform: string
    let extension: string

    if (process.platform === 'win32') {
      platform = 'win'
      extension = '.zip'
    } else if (process.platform === 'darwin') {
      platform = 'osx.12'
      extension = '.tar.gz'
    } else if (process.platform === 'linux') {
      platform = 'linux'
      extension = '.tar.gz'
    } else {
      throw new Error(`Unsupported platform: ${process.platform}`)
    }

    let versionString: string

    if (this.version === 'latest') {
      versionString = `latest/download`
    } else {
      versionString = `download/${this.version}`
    }

    const downloadURL = `https://github.com/microsoft/msstore-cli/releases/${versionString}/MSStoreCLI-${platform}-${process.arch}${extension}`

    core.debug(`Downloading tool from ${downloadURL}`)
    let downloadPath: string | null = null
    let archivePath: string | null = null
    const randomDir: string = uuidv4()
    const tempDir = path.join(os.tmpdir(), 'tmp', 'runner', randomDir)
    core.debug(`Creating tempdir ${tempDir}`)
    await io.mkdirP(tempDir)
    downloadPath = await tc.downloadTool(downloadURL)

    let name: string
    if (process.platform === 'win32') {
      name = 'msstore.exe'
    } else {
      name = 'msstore'
    }

    if (extension === '.tar.gz') {
      archivePath = await tc.extractTar(downloadPath, tempDir)
    } else {
      archivePath = await tc.extractZip(downloadPath, tempDir)
    }

    await this.moveToPath(archivePath, name)

    return io.rmRF(tempDir)
  }

  async moveToPath(downloadPath: string, name: string): Promise<void> {
    const toolPath = binPath()
    await io.mkdirP(toolPath)

    const dest = path.join(toolPath, name)
    if (!fs.existsSync(dest)) {
      fs.moveSync(downloadPath, toolPath, {overwrite: true})
    }

    if (process.platform !== 'win32') {
      await exec.exec('chmod', ['+x', dest])
    }

    core.addPath(toolPath)
  }

  validate(): void {
    if (
      process.platform !== 'win32' &&
      process.platform !== 'darwin' &&
      process.platform !== 'linux'
    ) {
      throw new Error(`Unsupported platform: ${process.platform}`)
    }
  }
}

export function binPath(): string {
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

  return path.join(baseLocation, os.userInfo().username, 'msstorecli')
}
