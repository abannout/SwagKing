import { handleEventsForPlanet } from "./planet/application/index.js"
import { handleEventsForRobot } from "./robot/application/index.js"
import { handleEventsForBank } from "./trading/application/index.js"
import * as relay from "./common/net/relay.js"
import logger from "./utils/logger.js"
import bankService from "./trading/usecase/index.js"
import { getCurrentRoundNumber } from "./state/game.js"
import { buyRobots } from "./trading/application/gateways/commands/buy-robot.js"
import robotService, {
  getAllRobots,
  mineResource,
} from "./robot/usecase/index.js"
import planetService from "./planet/usecase/index.js"
import { moveRobot } from "./robot/application/gateways/command/move-robot.js"
import { mineResources } from "./robot/application/gateways/command/mine-robot.js"
import { buyUpdates } from "./trading/application/gateways/commands/upgrade-robot.js"
import { sellResource } from "./trading/application/gateways/commands/sell-resources.js"
import Robot from "./robot/entity/robot.js"

export default function strategy() {
  handleEventsForBank()
  handleEventsForRobot()
  handleEventsForPlanet()
  theHundredRoundStrategy()
}

function theHundredRoundStrategy() {
  relay.on("RoundStatus", async (event, context) => {
    const { payload } = event

    if (payload.roundStatus === "started") {
      let robotList = await getAllRobots()
      if (payload.roundNumber < 4) {
        buyRobots(5)
      }
      if (payload.roundNumber > 3) {
        buyRobotsStrategy()
        updateMiningLevelForRobots()
        robotList = await mineResourcesOrMoveRobots(robotList)
        // robotList = await moveRobotWithoutResourcesRandomly(robotList)
        await sellResourcesWithFullInventory()
      }
    }
  })
}
export async function buyRobotsStrategy() {
  const bankBalance = await bankService.getBank()
  logger.info(
    `bank balance is ${bankBalance}  for Round number ${getCurrentRoundNumber()}`
  )

  const canBuyRobots = Math.floor(bankBalance / 100) - 2
  logger.info(
    `trying to buy 3 Robots for Round number ${getCurrentRoundNumber()}`
  )
  await buyRobots(canBuyRobots)
}

//toDo resource anpassen an level von Robot
async function mineResourcesOrMoveRobots(robotList: Robot[]): Promise<Robot[]> {
  const list = await mineResource(robotList)
  if (!list || list.length <= 0) return []
  list.map(async (robot) => {
    await mineResources(robot.id)
    logger.info(`mining robot with id: ${robot.id}`)
  })
  // const moveList = await robotService.moveRobot(robotList)
  // moveList.forEach(async (robot) => {
  //   const planetToMoveTo = await planetService.getPlanetToMoveTo(robot)
  //   logger.info(
  //     `Moving robot with id: ${robot.id} to Planet with id: ${planetToMoveTo}`
  //   )
  //   moveRobot(robot.id, planetToMoveTo)
  // })
  return robotList.filter((robot) => !list.some((item) => item.id === robot.id))
}

async function updateMiningLevelForRobots() {
  const robot = await robotService.getAllRobots()
  const bankBalance = await bankService.getBank()
  const robotToUpgrade = robot.filter((robot) => {
    return robot.miningSpeed == 0
  })
  if (bankBalance >= robotToUpgrade.length * 50 && robotToUpgrade.length > 0) {
    logger.info(
      "trying to upgrade robot with id: " +
        robot[0].id +
        " in planet: " +
        robot[0].planet.planetId
    )
    robotToUpgrade.forEach(async (robot) => {
      await buyUpdates(robot.id, "MINING_SPEED_1", robot.planet.planetId)
    })
  }
}

async function sellResourcesWithFullInventory() {
  try {
    const robotList = await robotService.sellResources()
    if (!robotList || robotList.length <= 0) {
      logger.info(
        "Can't sell any resources for the round: " + getCurrentRoundNumber()
      )
      return []
    }

    robotList.map(async (robot) => {
      await sellResource(robot.id)
      logger.info(`sold resources for robot: ${robot.id}`)
    })
    robotList.length = 0
  } catch (error) {
    logger.error("Error handling sell resources: " + (error as Error).message)
    return []
  }
}

const filterRobotList = (robotList: Robot[], list: Robot[]): Robot[] => {
  return robotList.filter((robot) => !list.some((item) => item.id === robot.id))
}
