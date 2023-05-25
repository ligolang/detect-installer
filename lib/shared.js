const fs = require("fs-extra");
const path = require("path");
const debugF = require("debug");

async function resolveCmd(platform, cmd) {
  let debug = debugF("resolveCmd");
  let envPath = process.env["PATH"];
  let paths = envPath.split(platform.pathSep);
  let possibleCmdExtensions;
  if (platform.isWindows) {
    possibleCmdExtensions = [
      "", // on cygwin, it's possible
      ".exe",
      ".ps1",
      ".cmd",
    ];
  } else {
    possibleCmdExtensions = [""];
  }

  let set = new Set();
  (
    await Promise.all(
      paths.map((p) => {
        return Promise.all(
          possibleCmdExtensions.map(async (ext) => {
            let fullPath = path.join(p, `${cmd}${ext}`);
            try {
              let stats = await fs.lstat(fullPath);
              if (stats.isSymbolicLink()) {
                return await fs.realpath(fullPath);
              } else if (stats.isFile()) {
                return fullPath;
              } else return null;
            } catch (e) {
              if (e.errno === -2 && e.code === "ENOENT") {
                debug(e.path);
                return null;
              }
            }
          })
        );
      })
    )
  )
    .flat()
    .filter((p) => p !== null)
    .forEach((p) => set.add(p));

  return set.size === 0 ? null : Array.from(set)[0];
}

module.exports.resolveCmd = resolveCmd;
