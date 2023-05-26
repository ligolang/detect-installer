const path = require("path");
const { resolveCmd } = require("./shared");
const Homebrew = require("./homebrew");
const NPM = require("./npm");
const fs = require("fs-extra");

async function detect(platform) {
  let ligoBinary = await resolveCmd(platform, "ligo");
  let npmBinary = await resolveCmd(platform, "npm");
  let yarnBinary = await resolveCmd(platform, "yarn");
  if (npmBinary && (await NPM.installedByMe(platform, npmBinary)) === true) {
    return "npm";
  }
  if (yarnBinary && (await Yarn.installedByMe(platform, yarnBinary)) === true) {
    return "yarn";
  }
  // Maybe installed by GUI installer? Is ligo_uninstaller.exe present?
  let uninstallerExists = await fs.exists(
    path.join(path.dirname(ligoBinary), "ligo_uninstaller.exe")
  );

  if (uninstallerExists) {
    return "GUI Installer";
  }
  return null;
}

module.exports = { detect };
