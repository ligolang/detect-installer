const { resolveCmd } = require("./shared");
const Homebrew = require("./homebrew");
const NPM = require("./npm");
const Pacman = require("./pacman");

async function detect(platform) {
  let ligoBinary = await resolveCmd(platform, "ligo");
  let brewBinary = await resolveCmd(platform, "brew");
  let npmBinary = await resolveCmd(platform, "npm");
  let pacmanBinary = await resolveCmd(platform, "pacman");
  if (brewBinary && (await Homebrew.installedByMe(platform, brewBinary)) === true) {
    return "brew";
  }
  if (npmBinary && (await NPM.installedByMe(platform, npmBinary)) === true) {
    return "npm";
  }
  if (pacmanBinary && (await Pacman.installedByMe(platform, pacmanBinary)) === true) {
    return "pacman";
  }
  return null;
}

module.exports = { detect };
