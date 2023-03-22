import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as exec from '@actions/exec'
import * as io from '@actions/io'
import * as msstoreconfigurator from './msstoreconfigurator'

const Version = 'version'

class GitHubPipeline implements msstoreconfigurator.IPipeline {
  debug(message: string): void {
    core.debug(message)
  }
  addPath(p: string): void {
    core.addPath(p)
  }
  async mkdirP(p: string): Promise<void> {
    return io.mkdirP(p)
  }
  async downloadTool(url: string): Promise<string> {
    return tc.downloadTool(url)
  }
  async extractTar(archivePath: string, dest: string): Promise<string> {
    return tc.extractTar(archivePath, dest)
  }
  async extractZip(archivePath: string, dest: string): Promise<string> {
    return tc.extractZip(archivePath, dest)
  }
  async rmRF(p: string): Promise<void> {
    return io.rmRF(p)
  }
  async exec(command: string, args: string[]): Promise<number> {
    return exec.exec(command, args)
  }
}

async function run(): Promise<void> {
  try {
    await msstoreconfigurator
      .getConfig(core.getInput(Version))
      .configure(new GitHubPipeline())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
