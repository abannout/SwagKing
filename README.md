# Player Skeleton with TypeScript and Node.js

This is a player skeleton for the microservice dungeon, which is written in TypeScript using Node.js.
You can use this player as a basis for your own player.

Requirements:
- Node.js 18

## Preparation

To use this skeleton as the base for your player development, you need to accomplish the following steps.

First, fork this repository and create a new repository under the [Player Teams subgroup](https://gitlab.com/the-microservice-dungeon/player-teams) which is named after your desired player name, for example `player-constantine`.
Now you need to add your player-name to a few files. The required places are marked using TODO comments.
Update the files in `helm-chart/Chart.yaml`, `src/config.ts` and `.gitlab-ci.yml`. You might also want to update the project name inside `package.json`, although this shouldn't be required.

Now install all required dependencies using `npm ci`.

## Usage

The skeleton comes with multiple scripts that can be used for development.
| Script  | Description                                                                                                                                                       |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| start   | simply starts the player. Requires compilation                                                                                                                    |
| compile | compiles the typescript files                                                                                                                                     |
| dev     | starts the player in dev mode. This creates and starts a player automatically for you. Also it listens for file changes and will recompile and restart the player **ONLY FOR LOCAL DEVELOPMENT** |
| format  | format project files with [prettier](https://prettier.io/)                                                                                                        |
| lint    | lint project files with [eslint](https://eslint.org/)                                                                                                             |
| test    | run tests with [mocha](https://mochajs.org/)                                                                                                                      |


## Configuration

The player can be configured using environment variables

| Environment Variable | Default                                       |
| -------------------- | --------------------------------------------- |
| RABBITMQ_HOST        | localhost                                     |
| RABBITMQ_PORT        | 5672                                          |
| RABBITMQ_USER        | admin                                         |
| RABBITMQ_PASSWORD    | admin                                         |
| GAME_URL             | http://localhost:8080                         |
| PLAYER_NAME          | layer-skeleton-typescript-nodejs              |
| PLAYER_EMAIL         | player-skeleton-typescript-nodejs@example.com |
| NODE_ENV             | development                                   |
| LOGGING_DIR          | logs                                          |
| LOGGING_LEVEL        | debug                                         |

## Development Hints

- The player skeleton is kept to a bare minimum
- All necessary types for our APIs are already defined in `src/types.d.ts`
- Required Commands can be defined in `src/commands.ts`. An exemplary command is already defined
- You most likely need to keep a state of your entities. Is it up to you, how you achieve this. There is an example in the `src/state` directory which keeps track over the game round and ID. The corresponding events are handeld in `src/state/state.ts`.
- Logging is being done using pino in JSON format. You can use [pino-pretty](https://github.com/pinojs/pino-pretty) for pretty printing or customize the logging by yourself.