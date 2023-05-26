const { Command } = require("commander");
const Windows = require("../lib/windows");
const Macos = require("../lib/macos");
const Linux = require("../lib/linux");
const Platform = require("../lib/platform");

const version = require("../package.json").version;

function globalErrorHandler(e) {
  if (e.errno === -3008 /* ENOTFOUND */ || e.errno === -3001 /* EAI_AGAIN */) {
    console.log("Could not find the source URL");
  } else {
    console.log("globalErrorHandler");
    console.log(e);
  }
  process.exit(-1);
}

function unSupportedPlatform(platform) {
  throw new Error(`Unsupported platform: ${platform}`);
}

async function main({ cwd }) {
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
      Windows.detect(platform);
      break;
  }
  console.log(installer);
}

const program = new Command();
let args = {
  cwd: process.cwd(),
};

program.version(version);

program
  .option("-C, --cwd [cwd]", "Set current working directory")
  .action(async () => {
    const { cwd } = program.opts();
    args.cwd = cwd;
  });

main(args);

process.on("uncaughtException", (err, origin) => {
  globalErrorHandler(err);
});
