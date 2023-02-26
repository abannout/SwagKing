# Player Hackschnitzel

This player is a Proof-of-Concept player.
It is being developed in a hacky way without following good coding practices, therefore its name.
In the beginning the player was designed to test specific game functionalities, but it has evolved over time
to participate at the codefight.
However, the player didn't get much upfront design, therefore some parts are questionable in design.
But it works, which is great and hopefully makes the codefight a bit more thrilling.

## Run

Note that the player has a pre-configured dev-mode which is enabled by default. In this mode
the player will manage the lifecycle by its own. To disable the dev mode, set a `NODE_ENV`
variable to something else than `development`.

```
# Install necessary dependencies
npm ci

# Set NODE_ENV to production (optional - see above)
export NODE_ENV=production

npm run compile && npm run start
```

## Configuration

The player can be configured using environment variables

| Environment Variable  | Default               |
| --------------------- | --------------------- |
| RABBITMQ_HOST         | localhost             |
| RABBITMQ_PORT         | 5672                  |
| RABBITMQ_USER         | admin                 |
| RABBITMQ_PASSWORD     | admin                 |
| GAME_URL              | http://localhost:8080 |
| HTTP_ENABLE           | true                  |
| HTTP_PORT             | 8000                  |
| PLAYER_NAME           | hackschnitzel         |
| PLAYER_EMAIL          | hack@schnitzel.org    |
| NODE_ENV              | development           |
| LOGGING_VISUALIZATION | true                  |
| LOGGING_DIR           | logs                  |
| LOGGING_LEVEL         | debug                 |

## HTTP Routes

| Route    | Description                              |
| -------- | ---------------------------------------- |
| /        | Hello World!                             |
| /fleet   | Get the players fleet as json            |
| /map     | Get the players map as json              |
| /map.svg | Get the players map visualization in svg |
| /map.dot | Get the players map visualization in dot |
| /radar   | Get the players radar as json            |
| /health  | Health Endpoint                          |
