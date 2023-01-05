import fleet from "./fleet";
import * as relay from "../net/relay";
import logger from "../utils/logger";
import map from "./map";

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
  });

  relay.on("RobotResourceRemovedIntegrationEvent", (event) => {
    logger.info("Robot removed a resource!");
    const { payload } = event;
    const robot = fleet.get(payload.robotId);

    if (!robot) {
      throw new Error("No Robot not in fleet.");
    }

    robot.inventory = payload.resourceInventory;
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
    }

    if (attacker) {
      attacker.alive = payload.target.alive;
      attacker.health = payload.target.availableHealth;
      attacker.energy = payload.target.availableEnergy;
    }
  });

  relay.on("RobotRegeneratedIntegrationEvent", (event) => {
    const { payload } = event;
    const robot = fleet.get(payload.robotId);

    if (!robot) {
      throw new Error("No Robot not in fleet.");
    }

    robot.energy = payload.availableEnergy;
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
  });

  relay.on("RobotUpgradedIntegrationEvent", (event) => {
    const { payload } = event;
    const robot = fleet.get(payload.robotId);

    if (!robot) {
      throw new Error("No Robot not in fleet.");
    }
    // TODO
  });

  relay.on("RobotMovedIntegrationEvent", (event) => {
    const { payload } = event;
    logger.info(`Robot ${payload.robotId} moved to planet ${payload.fromPlanet}`);
    map.moveRobot(payload.robotId, payload.fromPlanet.id, payload.toPlanet.id);
  });

  relay.on("planet-discovered", async (event) => {
    logger.info("Planet Discovered!");
    const planet = event.payload;
    map.setPlanet(planet);
    await map.draw();
  });
}