import { handleEventsForPlanet } from "./planet/application/index.js";
import { handleEventsForRobot } from "./robot/application/index.js";
import { handleEventsForBank } from "./trading/application/index.js";
import * as relay from "./common/net/relay.js";
import logger from "./utils/logger.js";
import bankService from "./trading/usecase/index.js";
import { getCurrentRoundNumber } from "./state/game.js";
import { buyRobots } from "./trading/application/gateways/commands/buy-robot.js";
import robotService, { mineResource } from "./robot/usecase/index.js";
import planetService from "./planet/usecase/index.js";
import { moveRobot } from "./robot/application/gateways/command/move-robot.js";
import { mineResources } from "./robot/application/gateways/command/mine-robot.js";
import { buyUpdates } from "./trading/application/gateways/commands/upgrade-robot.js";

export default function strategy() {
  handleEventsForBank();
  handleEventsForRobot();
  handleEventsForPlanet();
  theHundredRoundStrategy();
  moveRobotWithoutResourcesRandomly();
}

function theHundredRoundStrategy() {
  relay.on("RoundStatus", async (event, context) => {
    const { payload } = event;

    if (payload.roundStatus === "started" && payload.roundNumber < 100) {
      if (payload.roundNumber < 3) {
        buyRobotsStrategy();
      }
      if (payload.roundNumber == 3) {
        updateMiningLevelForRobots();
      }
      if (payload.roundNumber < 3) {
        mineResourcesOrMoveRobots();
      }
    }
  });
}
export async function buyRobotsStrategy() {
  const bankBalance = await bankService.getBank();
  logger.info(
    `bank balance is ${bankBalance}  for Round number ${getCurrentRoundNumber()}`
  );

  const canBuyRobots = Math.floor(bankBalance / 100);
  logger.info(
    `trying to buy ${canBuyRobots} Robots for Round number ${getCurrentRoundNumber()}`
  );
  await buyRobots(1);
}
async function mineResourcesOrMoveRobots() {
  const list = await mineResource();
  if (!list || list.length <= 0) return;
  list.forEach((robot) => {
    mineResources(robot.id);
    logger.info(`mining robot with id: ${robot.id}`);
  });
}
//toDo: Move if he cant doesnt ahve the level to mine this art of resources
async function moveRobotWithoutResourcesRandomly() {
  const robotToMove = await robotService.moveRobot();
  if (!robotToMove || robotToMove.length <= 0) return;
  robotToMove.forEach(async (robot) => {
    const planetToMoveTo = await planetService.getPlanetToMoveTo(robot);
    logger.info(
      `Moving robot with id: ${robot.id} to Planet with id: ${planetToMoveTo}`
    );
    moveRobot(robot.id, planetToMoveTo);
  });
}

async function updateMiningLevelForRobots() {
  const robot = await robotService.getAllRobots();
  const bankBalance = await bankService.getBank();
  if (bankBalance > 250 && robot.length > 0) {
    logger.info(
      "trying to upgrade robot with id: " +
        robot[0].id +
        " in planet: " +
        robot[0].planet.planetId
    );
    await buyUpdates(robot[0].id, "MINING_SPEED_1", robot[0].planet.planetId);
  }
}
