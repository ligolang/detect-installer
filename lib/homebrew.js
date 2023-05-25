const cp = require("child_process");
const { resolveCmd } = require("./shared");

const HOMEBREW_PACKAGE_NAME = "ligo";

let init = (binPath) => {
  return { binPath };
};

class HomebrewError extends Error {
  constructor({ message, error, stderr }) {
    super(message);
    this.error = error;
    this.stderr = stderr;
  }
}

/* returns brew list in a form useful for JS functions */
async function list({ binPath }) {
  return new Promise(function (resolve, reject) {
    cp.exec(`${binPath} list -1 --formula`, function (err, stdout, stderr) {
      if (err) {
        reject(
          new HomebrewError({
            message: "'brew list' failed.",
            error: err,
            stderr,
          })
        );
        return;
      }

      if (stdout === "") {
        reject(new HomebrewError("'brew list' returned empty output"));
        return;
      }

      resolve(stdout.split("\n"));
    });
  });
}

async function installedByMe(platform) {
  let brewBinary = await resolveCmd(platform, "brew");
  let brew = init(brewBinary);
  try {
    let installedPackages = await list(brew);
    return installedPackages.includes(HOMEBREW_PACKAGE_NAME);
  } catch (e) {
    if (e instanceof HomebrewError) {
      console.log(e);
    }
    return false;
  }
}

module.exports.init = init;
module.exports.list = list;
module.exports.Error = HomebrewError;
module.exports.installedByMe = installedByMe;
