const cp = require("child_process");

let isWindows;
let isMacos;
let isLinux;
let isIntel;
let isArm64;
let isCygwin;
let pathSep;

function uname() {
  return new Promise(function (resolve, reject) {
    let { spawn } = cp;
    let uname;
    uname = spawn("uname", ["-a"]);
    let stdout = "",
      stderr = "";

    uname.on("error", (err) => {
      reject(err);
    });

    uname.stdout.on("data", (data) => {
      stdout += data;
    });

    uname.stderr.on("data", (data) => {
      stderr += data;
    });

    uname.on("close", (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(
          new Error(`uname failed to run:
exit code: ${code}
stderr: ${stderr}`)
        );
      }
    });
  });
}

async function scan() {
  try {
    let unameStr = await uname();
    isCygwin = /cygwin/.test(unameStr);
  } catch (e) {
    isCygwin = false;
  }

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
