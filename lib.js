const FormData = require("form-data");
const fs = require("fs");
const chalk = require("chalk");
const { spawn } = require("child_process");
const { read } = require("./read");
const os = require("os");
const path = require("path");
const axios = require("axios");

function init(currentDir, name) {
  if (fs.existsSync(`${currentDir}/${name}`)) {
    console.error(
      chalk.red(
        `${currentDir}/${name} is not empty! choose an other addon name or relocate the directory`
      )
    );
    return;
  } else {
    fs.mkdirSync(`${currentDir}/${name}`);
    fs.copyFileSync(
      `${__dirname}/fixtures/addon/cfg.js`,
      `${currentDir}/${name}/config.js`
    );
    fs.copyFileSync(
      `${__dirname}/fixtures/addon/ignore`,
      `${currentDir}/${name}/.gitignore`
    );
    fs.copyFileSync(
      `${__dirname}/fixtures/addon/map.js`,
      `${currentDir}/${name}/map.js`
    );
    fs.copyFileSync(
      `${__dirname}/fixtures/addon/entity.js`,
      `${currentDir}/${name}/entity.js`
    );

    fs.mkdirSync(`${currentDir}/${name}/.tmp`);
    fs.copyFileSync(
      `${__dirname}/fixtures/addon/tmps/main.js`,
      `${currentDir}/${name}/.tmp/main.js`
    );
    fs.copyFileSync(
      `${__dirname}/fixtures/addon/tmps/addons.js`,
      `${currentDir}/${name}/.tmp/addons.js`
    );

    fs.mkdirSync(`${currentDir}/${name}/public`);
    fs.copyFileSync(
      `${__dirname}/fixtures/addon/pub/favicon.ico`,
      `${currentDir}/${name}/public/favicon.ico`
    );
    fs.copyFileSync(
      `${__dirname}/fixtures/addon/pub/index.html`,
      `${currentDir}/${name}/public/index.html`
    );
    fs.mkdirSync(`${currentDir}/${name}/public/data`);
    fs.copyFileSync(
      `${__dirname}/fixtures/addon/pub/data/gdp.json`,
      `${currentDir}/${name}/public/data/gdp.json`
    );
    fs.mkdirSync(`${currentDir}/${name}/public/topos`);
    fs.copyFileSync(
      `${__dirname}/fixtures/addon/pub/topos/world110m.json`,
      `${currentDir}/${name}/public/topos/world110m.json`
    );

    fs.mkdirSync(`${currentDir}/${name}/front`);
    fs.mkdirSync(`${currentDir}/${name}/components`);
    fs.writeFileSync(
      `${currentDir}/${name}/.tmp/index.js`,
      fs
        .readFileSync(`${__dirname}/fixtures/addon/tmps/index.js`, "utf8")
        .replace(/##name##/g, name)
    );
    fs.writeFileSync(
      `${currentDir}/${name}/package.json`,
      fs
        .readFileSync(`${__dirname}/fixtures/addon/package.json.sample`, "utf8")
        .replace(/##name##/g, name)
    );

    const yarnInstall = spawn("yarn", ["install", "--cwd", `./${name}`], {
      detached: false,
      stdio: "inherit",
    });
    yarnInstall.on("exit", (code) => {
      if (code !== 0) {
        console.warn(chalk.yellow(`Could not install dependencies.`));
        console.warn(chalk.yellow(`You can install them, by running:`));
        console.warn(chalk.yellow(`cd ${name}`));
        console.warn(chalk.yellow(`yarn install`));
      }
      return;
    });
  }
}
function build(currentDir) {
  let { name } = readPackage(currentDir);
  const vueCLIBuild = spawn(
    `${__dirname}/node_modules/.bin/vue-cli-service`,
    ["build", "--target", "lib", "--name", name, ".tmp/index.js"],
    {
      detached: false,
      stdio: "inherit",
    }
  );
  vueCLIBuild.on("exit", (code) => {
    if (code !== 0) {
      console.error(chalk.red(`'hexamaps-cli build' exited with code ${code}`));
    }
    return;
  });
}

async function config() {
  const confDir = path.join(os.homedir(), ".hexamaps");
  const configFile = path.join(confDir, ".auth.conf");
  if (!fs.existsSync(confDir)) {
    fs.mkdirSync(confDir);
  }

  let cookie = "";
  while (true) {
    const username = await read({ prompt: "username > " });
    const password = await read({ prompt: "password > ", silent: true });
    try {
      const result = await axios.post("auth/login", {
        username,
        password,
      });
      cookie = result.headers["set-cookie"][0];
      break;
    } catch {
      console.error(chalk.red("Login failed."));
      console.error("Please check your credentials and login again.");
    }
  }
  fs.writeFileSync(configFile, cookie, { encoding: "utf-8" });
  console.log(
    chalk.green(
      "Successfully authenticated, you may start publishing your addons."
    )
  );
}
function readCookie(currentDir) {
  const confDir = path.resolve(os.homedir(), ".hexamaps");
  const configFile = path.resolve(confDir, ".auth.conf");
  try {
    return fs.readFileSync(configFile, { encoding: "utf-8" });
  } catch {
    console.error(chalk.red("Config not found, please run config first."));
    return;
  }
}
function readPackage(currentDir) {
  const jsonConfigFile = path.resolve(currentDir, "package.json");
  try {
    const jsonconfig = JSON.parse(
      fs.readFileSync(jsonConfigFile, { encoding: "utf-8" })
    );
    const addonPrefix = "hm-addon-";
    return {
      jsonConfigFile,
      jsonconfig,
      name: jsonconfig.name.substr(addonPrefix.length),
      id: jsonconfig.hexamapsAddonId,
    };
  } catch {
    console.error(
      chalk.red(
        "package.json not found, please run publish in the root of your addon."
      )
    );
    return;
  }
}
function getBuildPath(currentDir) {
  try {
    return fs
      .readdirSync(path.resolve(currentDir, "dist"))
      .find((file) => file.endsWith(".umd.min.js"));
  } catch {
    console.error(chalk.red("Build not found,a please run build first."));
    return;
  }
}
async function publish(currentDir) {
  const cookie = readCookie(currentDir);
  const { name, id, jsonconfig, jsonConfigFile } = readPackage(currentDir);
  const buildPath = getBuildPath(currentDir);
  if (!cookie || !name || !buildPath) {
    return;
  }

  const form_data = new FormData();
  form_data.append(
    "pluginContent",

    fs.createReadStream(path.resolve(currentDir, "dist", buildPath)),
    { filename: "pluginContent.js" }
    // The file name doesn't really matter
    // We just need a .js extension to have it saved on the server
  );

  const { data } = await axios.post("addon", form_data, {
    headers: id
      ? {
          ...form_data.getHeaders(),
          cookie: cookie,
          name,
          id,
        }
      : {
          ...form_data.getHeaders(),
          cookie: cookie,
          name,
        },
  });
  jsonconfig.hexamapsAddonId = jsonconfig.hexamapsAddonId || data.id;
  console.log(
    chalk.green(
      `Your addon ${data.name} was deployed successfully and it's available at ${data.build}.`
    )
  );
  fs.writeFileSync(jsonConfigFile, JSON.stringify(jsonconfig, null, 4));
}
function start() {
  const vueCLIRun = spawn(
    `${__dirname}/node_modules/.bin/vue-cli-service`,
    ["serve", ".tmp/main.js"],
    {
      detached: false,
      stdio: "inherit",
    }
  );
  vueCLIRun.on("exit", (code) => {
    if (code !== 0) {
      console.error(chalk.red(`'hexamaps-cli run' exited with code ${code}`));
    }
    return;
  });
}
module.exports = { init, build, start, config, publish };
