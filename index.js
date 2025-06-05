#!/usr/bin/env node

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const path = require("path");
const { cleanConsolesInDir } = require("./lib/clean");

const argv = yargs(hideBin(process.argv))
  .usage("Usage: $0 <file|folder|all> [more...]")
  .demandCommand(1)
  .example("$0 all", "Removes all console statements from current folder")
  .example("$0 src utils/test.js", "Removes all console statements from multiple locations")
  .argv;

// Support multiple paths
const inputPaths = argv._.map(arg => (arg === "all" ? "." : arg));

inputPaths.forEach(p => {
  const fullPath = path.resolve(process.cwd(), p);
  cleanConsolesInDir(fullPath);
});
