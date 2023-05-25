const { resolveCmd } = require("./shared");
const Homebrew = require("./homebrew");
const NPM = require("./npm");
const Yarn = require("./yarn");
const Pacman = require("./pacman");

async function detect(platform) {
  let ligoBinary = await resolveCmd(platform, "ligo");
  let brewBinary = await resolveCmd(platform, "brew");
  let npmBinary = await resolveCmd(platform, "npm");
  let yarnBinary = await resolveCmd(platform, "yarn");
  let pacmanBinary = await resolveCmd(platform, "pacman");
  if (brewBinary && (await Homebrew.installedByMe(platform, brewBinary)) === true) {
    return "brew";
  }
  if (pacmanBinary && (await Pacman.installedByMe(platform, pacmanBinary)) === true) {
    return "pacman";
  }
  if (npmBinary && (await NPM.installedByMe(platform, npmBinary)) === true) {
    return "npm";
  }
  if (yarnBinary && (await Yarn.installedByMe(platform, yarnBinary)) === true) {
    return "yarn";
  }
  return null;
}

module.exports = { detect };
