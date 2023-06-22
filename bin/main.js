const { Command } = require("commander");
const detectInstaller = require("../lib/detect-installer");

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

async function main({ cwd }) {
  let installer = await detectInstaller({ cwd });
  console.log(installer);
}

main(args).catch(globalErrorHandler);

process.on("uncaughtException", (err, origin) => {
  globalErrorHandler(err);
});
