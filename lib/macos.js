const { resolveCmd } = require("./shared");
const Homebrew = require("./homebrew");
const NPM = require("./npm");

async function detect(platform) {
  let ligoBinary = await resolveCmd(platform, "ligo");
  if (Homebrew.installedByMe(platform) === true) {
    return "brew";
  }
  if ((await NPM.installedByMe(platform)) === true) {
    return "npm";
  }

  return null;
}

module.exports = { detect };
