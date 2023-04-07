import * as core from '@actions/core'
import * as msstoreconfigurator from './msstoreconfigurator'

async function run(): Promise<void> {
  try {
    await msstoreconfigurator.getConfig().configure()
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
