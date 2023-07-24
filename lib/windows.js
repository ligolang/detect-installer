const path = require("path");
const { resolveCmd } = require("./shared");
const NPM = require("./npm");
const Yarn = require("./yarn");
const fs = require("fs-extra");

async function detect(platform) {
  // Maybe installed by GUI installer? Is ligo_uninstaller.exe present?
  let ligoBinary = await resolveCmd(platform, "ligo");
  let uninstallerExists = await fs.exists(
    path.join(path.dirname(ligoBinary), "ligo_uninstaller.exe")
  );
  if (uninstallerExists) {
    return "GUI Installer";
  }
  let npmBinary = await resolveCmd(platform, "npm");
  if (npmBinary && (await NPM.installedByMe(platform, npmBinary)) === true) {
    return "npm";
  }
  let yarnBinary = await resolveCmd(platform, "yarn");
  if (yarnBinary && (await Yarn.installedByMe(platform, yarnBinary)) === true) {
    return "yarn";
  }
  return null;
}

module.exports = { detect };
