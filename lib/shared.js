const fs = require("fs-extra");
const path = require("path");
const debugF = require("debug");

async function resolveCmd(platform, cmd) {
  let debug = debugF("resolveCmd");
  let envPath = process.env["PATH"];
  let paths = envPath.split(platform.pathSep);
  let possibleCmdExtensions;
  if (platform.isWindows) {
    possibleCmdExtensions = [".exe", ".ps1", ".cmd"];
    if (platform.isCygwin) {
      possibleCmdExtensions.push("");
    }
  } else {
    possibleCmdExtensions = [""];
  }

  let possibleFilePaths = paths.reduce((acc, p) => {
    return acc.concat(
      possibleCmdExtensions.map((ext) => path.join(p, `${cmd}${ext}`))
    );
  }, []);

  let result = null;

  for (possibleFilePath of possibleFilePaths) {
    if (!!result) {
      debug("Found at", result);
      break;
    }
    let fullPath = possibleFilePath;
    try {
      debug("Trying %s", fullPath);
      let stats = await fs.lstat(fullPath);
      if (stats.isSymbolicLink()) {
        result = await fs.realpath(fullPath);
      } else if (stats.isFile()) {
        result = fullPath;
      } else return null;
    } catch (e) {
      if (e.errno === -2 && e.code === "ENOENT") {
        debug("Doesn't exist", e.path);
      }
    }
  }

  return result;
}

module.exports.resolveCmd = resolveCmd;
