const core = require('@actions/core')
const runCmd = require('./runCmd')

const server = core.getInput('server')
const username = core.getInput('username')
const password = core.getInput('password')
const image = core.getInput('image')
const tagFormat = core.getInput('tag_format')
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
  const commitSha = process.env.GITHUB_SHA
  const timestamp = String(Math.round(Date.now() / 1000))
  const semver = tagFormat.indexOf('{semver}') !== -1 ? getImageTagFromRef() : ''
  const tag = tagFormat.replace('{semver}', semver).replace('{sha}', commitSha).replace('{timestamp}', timestamp)
  return `${image}:${tag}`
}

process.on('uncaughtException', function (err) {
  if (err) {
    core.setFailed('Uncaught exception occured!')
  }
})

const fullImage = getFullImageName()
core.info(`Pushing Image: ${fullImage}`)

runCmd(['docker', 'login', '-u', username, '-p', password, server], 'DOCKER LOGIN')
runCmd(['docker', 'build', '-t', fullImage, '-f', dockerfile, location], 'DOCKER BUILD')
runCmd(['docker', 'push', fullImage], 'DOCKER PUSH')
runCmd(['docker', 'logout'], 'DOCKER LOGOUT')
