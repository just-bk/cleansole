#!/usr/bin/env node

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const path = require("path");
const { cleanConsolesInDir } = require("./lib/clean");

const argv = yargs(hideBin(process.argv))
  .usage("Usage: $0 [--log] [--warn] [--error] <file|folder|all> [more...]")
  .option("log", { type: "boolean", describe: "Remove console.log" })
  .option("warn", { type: "boolean", describe: "Remove console.warn" })
  .option("error", { type: "boolean", describe: "Remove console.error" })
  .option("info", { type: "boolean", describe: "Remove console.info" })
  .option("debug", { type: "boolean", describe: "Remove console.debug" })
  .option("trace", { type: "boolean", describe: "Remove console.trace" })
  .example("$0 --log --warn all", "Remove only console.log and console.warn from all files")
  .example("$0 --error script.ts", "Remove only console.error from script.ts")
  .demandCommand(1)
  .help()
  .argv;

const selectedTypes = [];
const allConsoleTypes = ["log", "warn", "error", "info", "debug", "trace"];

allConsoleTypes.forEach(type => {
  if (argv[type]) selectedTypes.push(type);
});

// If no flags given, default to removing all types
const finalTypes = selectedTypes.length > 0 ? selectedTypes : allConsoleTypes;

const inputPaths = argv._.map(arg => (arg === "all" ? "." : arg));

inputPaths.forEach(p => {
  const fullPath = path.resolve(process.cwd(), p);
  cleanConsolesInDir(fullPath, finalTypes);
});
