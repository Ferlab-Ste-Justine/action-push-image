const core = require('@actions/core')
const runCmd = require('./runCmd')

const username = core.getInput('username')
const password = core.getInput('password')
const image = core.getInput('image')
const tagSource = core.getInput('tag_source')
const location = core.getInput('location')
const dockerfile = core.getInput('dockerfile')

function getImageTagFromRef () {
  const ref = process.env.GITHUB_REF
  const gitTag = ref.split('/').slice(-1)[0]
  const imageTag = gitTag.match(/^v(\d+[.]\d+[.]\d+)$/)
  if (imageTag === null) {
    core.setFailed('Tag value needs to be \'vx.y.z\', following semver convention')
  }
  return imageTag[1]
}

function getFullImageName () {
  if (tagSource === 'sha') {
    return `${image}:${process.env.GITHUB_SHA}`
  } else if (tagSource === 'ref') {
    const imageTag = getImageTagFromRef()
    return `${image}:${imageTag}`
  }
  core.setFailed('tag_source needs to be either \'sha\' or \'ref\'')
}

process.on('uncaughtException', function (err) {
  if (err) {
    core.setFailed('Uncaught exception occured!')
  }
})

const fullImage = getFullImageName()

runCmd(['docker', 'login', '-u', username, '-p', password], 'DOCKER LOGIN')
runCmd(['docker', 'build', '-t', fullImage, '-f', dockerfile, location], 'DOCKER BUILD')
runCmd(['docker', 'push', fullImage], 'DOCKER PUSH')
runCmd(['docker', 'logout'], 'DOCKER LOGOUT')
