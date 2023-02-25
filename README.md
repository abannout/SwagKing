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
