const Windows = require("./windows");
const Macos = require("./macos");
const Linux = require("./linux");
const Platform = require("./platform");
function unSupportedPlatform(platform) {
  throw new Error(`Unsupported platform: ${platform}`);
}

async function detectInstaller({ cwd }) {
  let platform = await Platform.scan();
  let installer = null;
  switch (process.platform) {
    case "aix":
      unSupportedPlatform(process.platform);
      break;
    case "darwin":
      installer = await Macos.detect(platform);
      break;
    case "freebsd":
      unSupportedPlatform(process.platform);
      break;
    case "linux":
      installer = await Linux.detect(platform);
      break;
    case "openbsd":
      unSupportedPlatform(process.platform);
      break;
    case "sunos":
      unSupportedPlatform(process.platform);
      break;
    case "win32":
      installer = await Windows.detect(platform);
      break;
  }
  return installer;
}

module.exports = detectInstaller;
