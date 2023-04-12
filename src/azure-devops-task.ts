import * as taskLib from 'azure-pipelines-task-lib/task'
import * as toolLib from 'azure-pipelines-tool-lib/tool'
import * as msstoreconfigurator from './msstoreconfigurator'
import * as fs from 'fs'

const Version = 'version'

class AzurePipeline implements msstoreconfigurator.IPipeline {
  debug(message: string): void {
    taskLib.debug(message)
  }
  addPath(p: string): void {
    taskLib.prependPath(p)
  }
  async mkdirP(p: string): Promise<void> {
    taskLib.mkdirP(p)
  }
  async downloadTool(url: string): Promise<string> {
    return toolLib.downloadTool(url)
  }
  async extractTar(archivePath: string, dest: string): Promise<string> {
    return toolLib.extractTar(archivePath, dest)
  }
  async extractZip(archivePath: string, dest: string): Promise<string> {
    return toolLib.extractZip(archivePath, dest)
  }
  async rmRF(p: string): Promise<void> {
    taskLib.rmRF(p)
  }
  async exec(command: string, args: string[]): Promise<number> {
    return taskLib.exec(command, args)
  }
  moveSync(downloadPath: string, toolPath: string): void {
    this.rmRF(toolPath)
    fs.renameSync(downloadPath, toolPath)
  }
}

async function run(): Promise<void> {
  try {
    await msstoreconfigurator
      .getConfig(taskLib.getInput(Version) || 'latest')
      .configure(new AzurePipeline())
  } catch (err) {
    if (err instanceof Error)
      taskLib.setResult(taskLib.TaskResult.Failed, err.message)
  }
}

run()
