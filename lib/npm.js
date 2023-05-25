const cp = require("child_process");
const { resolveCmd } = require("./shared");

const NPM_PACKAGE_NAME = "ligolang";

let init = (binPath) => {
  return { binPath };
};

class NPMError extends Error {
  constructor({ message, error, stderr }) {
    super(message);
    this.error = error;
    this.stderr = stderr;
  }
}

/* returns brew list in a form useful for JS functions */
async function list({ binPath }) {
  return new Promise(function (resolve, reject) {
    cp.exec(
      `${binPath} list --depth=0 --global --json`,
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
        let dependencies = JSON.parse(stdout).dependencies;
        resolve(
          Object.keys(dependencies).map((k) => ({
            name: k,
            ...dependencies[k],
          }))
        );
      }
    );
  });
}

async function installedByMe(platform) {
  let npmBinary = await resolveCmd(platform, "npm");
  let brew = init(npmBinary);
  try {
    let installedPackages = await list(brew);
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
