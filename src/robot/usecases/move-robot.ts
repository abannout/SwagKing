import logger from "../../utils/logger.js";
import * as relay from "../../common/net/relay.js";
import { mineResources } from "./command/mine-robot.js";
import { makeUpdateInventory } from "../service/mine-resource.js";
import { RobotDependencies } from "../../common/dependencies/robot-dependency.js";
import makeRobotsToMove from "../service/robots-to-Move.js";
import makeMoveToPlanet from "../../planet/service/move-to-planet.js";
import { PlanetDependencies } from "../../common/dependencies/planet-dependency.js";
import { moveRobot } from "./command/move-robot.js";
import makegetRobot from "../service/get-robot.js";
import makeGetPlanet from "../../planet/service/get-planet.js";

//toDo: map the dtos to robotinventory
export function makeRobotMove(
  { robotRepo }: RobotDependencies,
  { planetRepo }: PlanetDependencies
) {
  return async () => {
    relay.on("RoundStatus", async (event, context) => {
      const { payload } = event;

      if (
        payload.roundStatus === "command input ended" ||
        payload.roundStatus === "ended" ||
        payload.roundNumber <= 2
      ) {
        return;
      }
      const getRobotToMove = makeRobotsToMove({ robotRepo });
      const robotToMove = await getRobotToMove();
      const getMoveToPlanet = makeMoveToPlanet({ planetRepo });
      if (!robotToMove || robotToMove.length <= 0) return;
      robotToMove.forEach(async (robot) => {
        const planetToMoveTo = await getMoveToPlanet(robot);
        logger.info(
          `Moving robot with id: ${robot.id} to Planet with id: ${planetToMoveTo}`
        );
        moveRobot(robot.id, planetToMoveTo);
        logger.info(
          `Moving robot with id: ${robot.id} to Planet with id: ${planetToMoveTo}`
        );
      });
      robotToMove.length = 0;
    });
  };
}

export function handleRobotMoved(
  { robotRepo }: RobotDependencies,
  { planetRepo }: PlanetDependencies
) {
  return async () => {
    relay.on("RobotMoved", async (event, context) => {
      const { payload } = event;
      const getRobot = makegetRobot({ robotRepo });
      const robot = await getRobot(payload.robotId);
      robot.planet.planetId = payload.toPlanet.id;
      const getPlanet = makeGetPlanet({ planetRepo });
      const planetResources = await getPlanet(payload.toPlanet.id);
      robot.planet.resourceType = planetResources.resource?.type || null;
    });
  };
}
