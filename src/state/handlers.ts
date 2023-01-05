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

  relay.on("RobotInventoryUpdated", (event) => {
    logger.info("Robot Inventory updated!");
    const robot = fleet.first();

    if (!robot) {
      throw new Error("No Robot in fleet. Perhaps it has been killed?");
    }

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