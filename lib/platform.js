const cp = require("child_process");

let isWindows;
let isMacos;
let isLinux;
let isIntel;
let isArm64;
let isCygwin;
let pathSep;

function uname() {
  return cp.execSync("uname -a");
}

async function scan() {
  let unameStr = uname();
  isCygwin = /cygwin/.test(unameStr);

  if (isWindows && !isCygwin) {
    pathSep = ";";
  } else {
    pathSep = ":";
  }

  isWindows = process.platform == "win32";
  isMacos = process.platform == "darwin";
  isLinux = process.platform == "linux";
  isIntel = process.arch == "x64";
  isArm64 = process.arch == "arm64";

  return {
    isWindows,
    isMacos,
    isLinux,
    isIntel,
    isArm64,
    isCygwin,
    pathSep,
  };
}

module.exports.scan = scan;
