const cp = require("child_process");
const { resolveCmd } = require("./shared");

const PACMAN_PACKAGE_NAME = "ligo-bin";

let init = (binPath) => {
  return { binPath };
};

class PacmanError extends Error {
  constructor({ message, error, stderr }) {
    super(message);
    this.error = error;
    this.stderr = stderr;
  }
}

/* returns package -Qs in a form useful for JS functions */
async function query({ binPath  }, pkg) {
  return new Promise(function (resolve, reject) {
    cp.exec(`${binPath} -Qs ${pkg}`, function (err, stdout, stderr) {
      if (err) {
	resolve(false);
        return;
      }

      if (stdout === "") {
        reject(new PacmanError("'package -Qs' returned empty output"));
        return;
      }

      resolve(true);
    });
  });
}

async function installedByMe(platform, pacmanBinary) {
  let pacman = init(pacmanBinary);
  try {
    return await query(pacman, PACMAN_PACKAGE_NAME);
  } catch (e) {
    if (e instanceof PacmanError) {
      console.log(e);
    }
    return false;
  }
}

module.exports.init = init;
module.exports.query = query;
module.exports.Error = PacmanError;
module.exports.installedByMe = installedByMe;
