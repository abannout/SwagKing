import * as relay from "../net/relay";
import { Tradable } from "../types";
import logger from "../utils/logger";
import bank from "./bank";
import fleet from "./fleet";
import map from "./map";
import price from "./price";

export function setupStateHandlers() {
  relay.on("RobotSpawnedIntegrationEvent", (event) => {
    logger.info("Robot Spawned!");
    const { robot } = event.payload;
    fleet.add(robot);
    map.setRobot(robot.id, robot.planet.planetId);
  });

  relay.on("RobotResourceMinedIntegrationEvent", (event) => {
    logger.info("Robot Mined a resource!");
    const robot = fleet.get(event.payload.robotId);

    if (!robot) {
      throw new Error("No Robot not in fleet.");
    }

    robot.inventory = event.payload.resourceInventory;
    fleet.set(robot);
  });

  relay.on("RobotResourceRemovedIntegrationEvent", (event) => {
    logger.info("Robot removed a resource!");
    const { payload } = event;
    const robot = fleet.get(payload.robotId);

    if (!robot) {
      throw new Error("No Robot not in fleet.");
    }

    robot.inventory = payload.resourceInventory;
    fleet.set(robot);
  });

  relay.on("RobotAttackedIntegrationEvent", (event) => {
    logger.info("Robot removed a resource!");
    const { payload } = event;
    const target = fleet.get(payload.target.robotId);
    const attacker = fleet.get(payload.attacker.robotId);

    if (target) {
      target.alive = payload.target.alive;
      target.health = payload.target.availableHealth;
      target.energy = payload.target.availableEnergy;
      fleet.set(target);
    }

    if (attacker) {
      attacker.alive = payload.target.alive;
      attacker.health = payload.target.availableHealth;
      attacker.energy = payload.target.availableEnergy;
      fleet.set(attacker);
    }
  });

  relay.on("RobotRegeneratedIntegrationEvent", (event) => {
    const { payload } = event;
    const robot = fleet.get(payload.robotId);

    if (!robot) {
      throw new Error("No Robot not in fleet.");
    }

    robot.energy = payload.availableEnergy;
    fleet.set(robot);
  });

  relay.on("RobotRestoredAttributesIntegrationEvent", (event) => {
    const { payload } = event;
    logger.info(`Robot restored ${payload.restorationType}`);
    const robot = fleet.get(payload.robotId);

    if (!robot) {
      throw new Error("No Robot not in fleet.");
    }

    robot.energy = payload.availableEnergy;
    robot.health = payload.availableHealth;
    fleet.set(robot);
  });

  relay.on("RobotUpgradedIntegrationEvent", (event) => {
    const { payload } = event;
    let robot = fleet.get(payload.robotId);

    if (!robot) {
      throw new Error("No Robot not in fleet.");
    }

    // Smart lol
    robot = { ...payload.robot, inventory: robot.inventory };
    fleet.set(robot);
  });

  relay.on("RobotMovedIntegrationEvent", (event) => {
    const { payload } = event;
    logger.info(
      `Robot ${payload.robotId} moved to planet ${payload.fromPlanet}`
    );
    map.moveRobot(payload.robotId, payload.fromPlanet.id, payload.toPlanet.id);
    const robot = fleet.get(payload.robotId);
    if (robot === undefined) {
      logger.info("Detected a movement from another robot");
      return;
    }
    robot.energy = payload.remainingEnergy;
  });

  relay.on("PlanetDiscovered", async (event) => {
    logger.info("Planet Discovered!");
    const planet = event.payload;
    map.setPlanet(planet);
    await map.draw();
  });

  relay.on("BankAccountCleared", (event) => {
    logger.info("BankAccount cleared");
    bank.init(event.payload.balance);
  });

  relay.on("BankAccountInitialized", (event) => {
    const { payload } = event;
    logger.info(`BankAccount initialized with: ${payload.balance}`);
    bank.init(payload.balance);
  });

  relay.on("BankAccountTransactionBooked", (event) => {
    const { payload } = event;
    logger.info(
      `BankAccount transaction with: ${payload.transactionAmount}. Expected amount: ${payload.balance}`
    );
    bank.put(payload.transactionAmount);
    const check = bank.check(payload.balance);
    if (!check) {
      logger.error(
        `The expected amount did not match. expected: ${
          payload.balance
        } got: ${bank.get()}`
      );
    }
  });

  let firstAnnouncement = true;
  relay.on("TradablePrices", (event) => {
    const { payload } = event;

    // Hacky to not flood
    if (firstAnnouncement) {
      firstAnnouncement = false;
      // Helper for string representation
      const s = payload
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((t) => `${t.name}: ${t.price}`)
        .join(",");

      logger.info(`New prices have been announced: ${s}`);
    }

    const prices: Partial<Record<Tradable, number>> = {};

    for (const p of payload) {
      prices[p.name] = p.price;
    }

    price.set(prices);
  });

  relay.on("TradableBought", (event) => {
    const { payload } = event;
    logger.info(
      `Bought ${payload.amount}x${payload.name} for ${payload.totalPrice}`
    );
  });

  relay.on("TradableSold", (event) => {
    const { payload } = event;
    logger.info(
      `Sold ${payload.amount}x${payload.name} for ${payload.totalPrice}`
    );
  });

  relay.on("RobotsRevealedIntegrationEvent", (event) => {
    const { payload } = event;
    logger.info(`Revealed ${payload.robots.length} robots`);
  });
}
