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
    figlet.textSync('DotMap', { horizontalLayout: 'full' })
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
      console.error(chalk.red('`init` must have the addon name as argument, for instance `dotmap init myAddon`'))
      return
    }
    if (fs.existsSync(`${currentDir}/${name}`)) {
      console.error(chalk.red(`${currentDir}/${name} is not empty! choose an other addon name or relocate the directory`))
      return
    } else {
      fs.mkdirSync(`${currentDir}/${name}`)
      fs.copyFileSync(`${__dirname}/fixtures/addon/config.js`, `${currentDir}/${name}/config.js`)
      fs.copyFileSync(`${__dirname}/fixtures/addon/.gitignore`, `${currentDir}/${name}/.gitignore`)

      fs.mkdirSync(`${currentDir}/${name}/.tmp`)
      fs.copyFileSync(`${__dirname}/fixtures/addon/.tmp/main.js`, `${currentDir}/${name}/.tmp/main.js`)
      fs.copyFileSync(`${__dirname}/fixtures/addon/.tmp/transpile.js`, `${currentDir}/${name}/.tmp/transpile.js`)

      fs.mkdirSync(`${currentDir}/${name}/public`)
      fs.copyFileSync(`${__dirname}/fixtures/addon/public/favicon.ico`, `${currentDir}/${name}/public/favicon.ico`)
      fs.copyFileSync(`${__dirname}/fixtures/addon/public/index.html`, `${currentDir}/${name}/public/index.html`)
      fs.mkdirSync(`${currentDir}/${name}/public/data`)
      fs.copyFileSync(`${__dirname}/fixtures/addon/public/data/gdp.json`, `${currentDir}/${name}/public/data/gdp.json`)
      fs.mkdirSync(`${currentDir}/${name}/public/topos`)
      fs.copyFileSync(`${__dirname}/fixtures/addon/public/topos/world110m.json`, `${currentDir}/${name}/public/topos/world110m.json`)

      fs.mkdirSync(`${currentDir}/${name}/back`)
      fs.mkdirSync(`${currentDir}/${name}/front`)
      fs.mkdirSync(`${currentDir}/${name}/components`)
      fs.writeFileSync(
        `${currentDir}/${name}/index.js`,
        fs.readFileSync(`${__dirname}/fixtures/addon/index.js.tpl`, 'utf8')
          .replace(/##name##/g, name)
      )
      fs.writeFileSync(
        `${currentDir}/${name}/package.json`,
        fs.readFileSync(`${__dirname}/fixtures/addon/package.json.tpl`, 'utf8')
          .replace(/##name##/g, name)
      )

      const npmInstall = spawn('npm', ['install', '--prefix', `./${name}`],
        {
          detached: false,
          stdio: 'inherit'
        }
      )
      npmInstall.on('exit', (code) => {
        if (code !== 0) {
          console.warn(chalk.yellow(`Could not install dependencies.`))
          console.warn(chalk.yellow(`You can install them, by running:`))
          console.warn(chalk.yellow(`cd ${name}`))
          console.warn(chalk.yellow(`npm i`))
        }
        return
      })
    }
    break
  case 'test':
    break
  case 'lint':
    break
  case 'publish':
    break
  case 'run':
    const vueCLI = spawn(`${__dirname}/node_modules/.bin/vue-cli-service`, ['serve', '.tmp/main.js'],
      {
        detached: false,
        stdio: 'inherit'
      }
    )
    vueCLI.on('exit', (code) => {
      if (code !== 0) {
        console.error(chalk.red(`'DotMap run' exited with code ${code}`))
      }
      return
    })
    break
  default:
    console.error(chalk.red(`Unrogonized command '${command}'!`))
    help()
}
