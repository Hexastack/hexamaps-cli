#!/usr/bin/env node
const yargs = require("yargs");
const lib = require("./lib");
const axios = require("axios");
axios.defaults.baseURL =
  process.env.HEXAMAPS_URL || "https://hexamaps.com/api/v1/";
const currentDir = process.cwd();
yargs
  .scriptName("hexamaps")
  .usage("$0 <cmd> [args]")
  .command(
    ["init [name]", "i [name]"],
    "Initialize a new hexamaps addon in the specified directory.",
    (yargs) => {
      yargs
        .positional("name", {
          type: "string",
          describe: "Addon name , a directory with this name will be created.",
        })
        .demandOption("name");
    },
    function(argv) {
      lib.init(currentDir, argv.name);
    }
  )
  .command(
    ["build", "b"],
    "Build the addon",
    (yargs) => {},
    function(argv) {
      lib.build(currentDir);
    }
  )
  .command(
    ["dev", "start"],
    "Start the development environment for the addon.",
    (yargs) => {},
    function(argv) {
      lib.start();
    }
  )
  .command(
    ["publish"],
    "Publish your extension and make it available publicly in hexamaps.",
    (yargs) => {},
    function(argv) {
      lib.build(currentDir).then(() => lib.publish(currentDir));
    }
  )
  .command(
    ["authenticate"],
    "Get authenticated to start publishing NOW!!",
    (yargs) => {},
    function(argv) {
      lib.config();
    }
  )
  .strict()
  .showHelpOnFail(true)
  .demandCommand(1, '')
  .help().argv;