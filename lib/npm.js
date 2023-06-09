const cp = require("child_process");
const { resolveCmd } = require("./shared");

const NPM_PACKAGE_NAME = "ligolang";

let init = (cmd, binPath) => {
  return { cmd, binPath };
};

class NPMError extends Error {
  constructor({ message, error, stderr }) {
    super(message);
    this.error = error;
    this.stderr = stderr;
  }
}

/* returns npm list in a form useful for JS functions */
async function list({ binPath, cmd }) {
  return new Promise(function (resolve, reject) {
    cp.exec(
      `${
        process.platform == "win32" ? cmd : binPath
      } list --depth=0 --global --json`,
      function (err, stdout, stderr) {
        if (err) {
          reject(
            new NPMError({
              message: "'npm list' failed.",
              error: err,
              stderr,
            })
          );
          return;
        }

        if (stdout === "") {
          reject(new NPMError("'npm list' returned empty output"));
          return;
        }

        try {
          let dependencies = JSON.parse(stdout).dependencies;
          resolve(
            Object.keys(dependencies).map((k) => ({
              name: k,
              ...dependencies[k],
            }))
          );
        } catch (e) {
          reject(e);
        }
      }
    );
  });
}

async function installedByMe(platform, npmBinary) {
  let npm = init("npm", npmBinary);
  try {
    let installedPackages = await list(npm);
    return installedPackages.map((p) => p.name).includes(NPM_PACKAGE_NAME);
  } catch (e) {
    if (e instanceof NPMError) {
      console.log(e);
    }
    return false;
  }
}

module.exports.init = init;
module.exports.list = list;
module.exports.Error = NPMError;
module.exports.installedByMe = installedByMe;
