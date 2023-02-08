# Player Hackschnitzel

This player is a Proof-of-Concept player, which doesn't follow any tactics or game mechanics.
It is being developed in a hacky way without following good coding practices.

## Run

Note that the player has a pre-configured dev-mode which is enabled by default. In this mode 
the player will manage the lifecycle by its own. To disable the dev mode, set a `NODE_ENV` 
variable to something else than `production`.


```
# Install necessary dependencies
npm ci

# Set NODE_ENV to production (optional - see above)
export NODE_ENV=production

npm run compile && npm run start
```