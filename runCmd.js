const childProcess = require('child_process')

const core = require('@actions/core')

function runCmd (cmd, label = '') {
  if (label.length > 0) {
    console.log(label)
  }
  const result = childProcess.spawnSync(cmd[0], cmd.slice(1))
  if (result.stdout.length > 0) {
    console.log(result.stdout.toString())
  }
  if (result.stderr.length > 0) {
    console.error(result.stderr.toString)
  }

  if (result.status > 0) {
    core.setFailed(`Command failed with code ${result.status}`)
  }
}

module.exports = runCmd
