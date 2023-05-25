const cp = require("child_process");
const { resolveCmd } = require("./shared");

const YARN_BIN_NAME = "ligo";

let init = (binPath) => {
  return { binPath };
};

class YarnError extends Error {
  constructor({ message, error, stderr }) {
    super(message);
    this.error = error;
    this.stderr = stderr;
  }
}

/* returns yarn list in a form useful for JS functions */
async function list({ binPath }) {
  return new Promise(function (resolve, reject) {
    cp.exec(
      `${binPath} global list`,
      function (err, stdout, stderr) {
        if (err) {
          reject(
            new YarnError({
              message: "'yarn list' failed.",
              error: err,
              stderr,
            })
          );
          return;
        }

        if (stdout === "") {
          reject(new YarnError("'yarn list' returned empty output"));
          return;
        }

	resolve(stdout.split("\n").filter(l => l.indexOf(" - ") !== -1).map(l => {
	  return l.replace("-", "").trim()
	}));
      }
    );
  });
}

async function installedByMe(platform, yarnBinary) {
  let yarn = init(yarnBinary);
  try {
    let installedPackages = await list(yarn);
    return installedPackages.includes(YARN_BIN_NAME);
  } catch (e) {
    if (e instanceof YarnError) {
      console.log(e);
    }
    return false;
  }
}

module.exports.init = init;
module.exports.list = list;
module.exports.Error = YarnError;
module.exports.installedByMe = installedByMe;
