#!/usr/bin/env node

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const path = require("path");
const { cleanConsolesInDir } = require("./lib/clean");

const argv = yargs(hideBin(process.argv))
  .usage("Usage: $0 <directory>")
  .demandCommand(1)
  .example("$0 ./src", "Removes all console statements from ./src")
  .argv;

const targetDir = path.resolve(process.cwd(), argv._[0]);

cleanConsolesInDir(targetDir);
