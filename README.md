# HexaMaps CLI
Is a command line interface that streamline [hexamaps's](https://github.com/Hexastack/hexamaps) addon creation.

## Getting started
Install the CLI globally:
```sh
sudo npm install -g hexamaps-cli
```
Create your own addon by running:
```sh
hexamaps-cli init myAddon
```
Give it a test run:
```sh
cd myAddon
hexamaps-cli run
```
That's it, celebrate :beer:! and start implementing your addon :keyboard: :smoking:.
You can refer to [HexaMaps' documentation](https://github.com/Hexastack/hexamaps/docs) for the implementation part.

## Commands
hexamaps CLI usage:
``hexamaps-cli`` ``<command>`` ``<args>`` ``--option values``

| command | args | description |
|---------|------|-------------|
| init    | addon name | Create a new addon project |
| run     | | Run the addon within HexaMaps |
| lint    | - | NOT YET IMPLEMENTED |
| test    | - | NOT YET IMPLEMENTED |
| publish | - | NOT YET IMPLEMENTED |

With :heart:
