const { resolveCmd } = require("./shared");
const Homebrew = require("./homebrew");
const NPM = require("./npm");
const Yarn = require("./yarn");

async function detect(platform) {
  let ligoBinary = await resolveCmd(platform, "ligo");
  let brewBinary = await resolveCmd(platform, "brew");
  let npmBinary = await resolveCmd(platform, "npm");
  let yarnBinary = await resolveCmd(platform, "yarn");
  if (npmBinary && (await NPM.installedByMe(platform, npmBinary)) === true) {
    return "npm";
  }
  if (yarnBinary && (await Yarn.installedByMe(platform, yarnBinary)) === true) {
    return "yarn";
  }
  if (
    brewBinary &&
    (await Homebrew.installedByMe(platform, brewBinary)) === true
  ) {
    return "brew";
  }
  return null;
}

module.exports = { detect };
