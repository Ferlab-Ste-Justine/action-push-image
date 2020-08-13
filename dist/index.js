module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(973);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 129:
/***/ (function(module) {

module.exports = require("child_process");

/***/ }),

/***/ 688:
/***/ (function(module) {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 794:
/***/ (function(module, __unusedexports, __webpack_require__) {

const childProcess = __webpack_require__(129)

const core = __webpack_require__(688)

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


/***/ }),

/***/ 973:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

const core = __webpack_require__(688)
const runCmd = __webpack_require__(794)

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


/***/ })

/******/ });