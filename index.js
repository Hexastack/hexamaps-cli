#!/usr/bin/env node
const yargs = require("yargs");
const lib = require("./lib");
const axios = require("axios");
if (process.env.NODE_ENV === "development") {
  axios.defaults.baseURL = "http://localhost:1337/";
} else {
  axios.defaults.baseURL = "http://hexamaps.com/api/";
}
const currentDir = process.cwd();
yargs
  .scriptName("hexamaps")
  .usage("$0 <cmd> [args]")
  .command(
    ["init [name]", "i [name]"],
    "Initializes a new hexamaps addon in the specified directory.",
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
    "Builds the addon",
    (yargs) => {},
    function(argv) {
      lib.build(currentDir);
    }
  )
  .command(
    ["dev", "start"],
    "Starts the development environment for the addon.",
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
      lib.publish(currentDir);
    }
  )
  .command(
    ["config"],
    "Starts the development environment for the addon.",
    (yargs) => {},
    function(argv) {
      lib.config();
    }
  )
  .help().argv;
