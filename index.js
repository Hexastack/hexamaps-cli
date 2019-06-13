#!/usr/bin/env node
const fs          = require('fs')
const { spawn }    = require('child_process')

const chalk       = require('chalk')
const clear       = require('clear')
const figlet      = require('figlet')

const args        = require('minimist')(process.argv.slice(2))

const currentDir  = process.cwd()

clear()
console.log(
  chalk.rgb(239, 203, 104)(
    figlet.textSync('HexaMaps', { horizontalLayout: 'full' })
  )
)

// Function that display help
let helpText = ''
const help = () => {
  if (!helpText)
    helpText = fs.readFileSync(`${__dirname}/fixtures/help.txt`)
  console.log(chalk.grey(helpText))
}



if (!args._ || !args._[0]) {
  console.error(chalk.red('No command was provided!'))
  help()
  return
}
const command = args._[0]
const name = args._[1] || ''
switch(command) {
  case 'init':
    if (!name) {
      console.error(chalk.red('`init` must have the addon name as argument, for instance `hexamaps-cli init myAddon`'))
      return
    }
    if (fs.existsSync(`${currentDir}/${name}`)) {
      console.error(chalk.red(`${currentDir}/${name} is not empty! choose an other addon name or relocate the directory`))
      return
    } else {
      fs.mkdirSync(`${currentDir}/${name}`)
      fs.copyFileSync(`${__dirname}/fixtures/addon/cfg.js`, `${currentDir}/${name}/config.js`)
      fs.copyFileSync(`${__dirname}/fixtures/addon/ignore`, `${currentDir}/${name}/.gitignore`)
      fs.copyFileSync(`${__dirname}/fixtures/addon/map.js`, `${currentDir}/${name}/map.js`)
      fs.copyFileSync(`${__dirname}/fixtures/addon/entity.js`, `${currentDir}/${name}/entity.js`)

      fs.mkdirSync(`${currentDir}/${name}/.tmp`)
      fs.copyFileSync(`${__dirname}/fixtures/addon/tmps/main.js`, `${currentDir}/${name}/.tmp/main.js`)
      fs.copyFileSync(`${__dirname}/fixtures/addon/tmps/addons.js`, `${currentDir}/${name}/.tmp/addons.js`)

      fs.mkdirSync(`${currentDir}/${name}/public`)
      fs.copyFileSync(`${__dirname}/fixtures/addon/pub/favicon.ico`, `${currentDir}/${name}/public/favicon.ico`)
      fs.copyFileSync(`${__dirname}/fixtures/addon/pub/index.html`, `${currentDir}/${name}/public/index.html`)
      fs.mkdirSync(`${currentDir}/${name}/public/data`)
      fs.copyFileSync(`${__dirname}/fixtures/addon/pub/data/gdp.json`, `${currentDir}/${name}/public/data/gdp.json`)
      fs.mkdirSync(`${currentDir}/${name}/public/topos`)
      fs.copyFileSync(`${__dirname}/fixtures/addon/pub/topos/world110m.json`, `${currentDir}/${name}/public/topos/world110m.json`)

      fs.mkdirSync(`${currentDir}/${name}/front`)
      fs.mkdirSync(`${currentDir}/${name}/components`)
      fs.writeFileSync(
        `${currentDir}/${name}/.tmp/index.js`,
        fs.readFileSync(`${__dirname}/fixtures/addon/tmps/index.js`, 'utf8')
          .replace(/##name##/g, name)
      )
      fs.writeFileSync(
        `${currentDir}/${name}/package.json`,
        fs.readFileSync(`${__dirname}/fixtures/addon/package.json.sample`, 'utf8')
          .replace(/##name##/g, name)
      )

      const yarnInstall = spawn('yarn', ['install', '--cwd', `./${name}`],
        {
          detached: false,
          stdio: 'inherit'
        }
      )
      yarnInstall.on('exit', (code) => {
        if (code !== 0) {
          console.warn(chalk.yellow(`Could not install dependencies.`))
          console.warn(chalk.yellow(`You can install them, by running:`))
          console.warn(chalk.yellow(`cd ${name}`))
          console.warn(chalk.yellow(`yarn install`))
        }
        return
      })
    }
    break
  case 'build':
    //./node_modules/.bin/vue-cli-service build --target lib --name incept ./.tmp/index.js
    const vueCLIBuild = spawn(`${__dirname}/node_modules/.bin/vue-cli-service`, ['build', '--target', 'lib', '--name', name, '.tmp/main.js'],
      {
        detached: false,
        stdio: 'inherit'
      }
    )
    vueCLIBuild.on('exit', (code) => {
      if (code !== 0) {
        console.error(chalk.red(`'hexamaps-cli build' exited with code ${code}`))
      }
      return
    })
    break
  case 'test':
    break
  case 'lint':
    break
  case 'publish':
    break
  case 'run':
    const vueCLIRun = spawn(`${__dirname}/node_modules/.bin/vue-cli-service`, ['serve', '.tmp/main.js'],
      {
        detached: false,
        stdio: 'inherit'
      }
    )
    vueCLIRun.on('exit', (code) => {
      if (code !== 0) {
        console.error(chalk.red(`'hexamaps-cli run' exited with code ${code}`))
      }
      return
    })
    break
  default:
    console.error(chalk.red(`Unrogonized command '${command}'!`))
    help()
}
