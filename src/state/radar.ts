import { RevealedRobot, SpottedRobot } from "../types";

let spottedRobots: Record<string, SpottedRobot> = {};

export function next(robots: RevealedRobot[]) {
  for (const robot of robots) {
    const existing = spottedRobots[robot.robotId];
    if (existing === undefined) {
      spottedRobots[robot.robotId] = {
        id: robot.robotId,
        levels: robot.levels,
        playerNotion: robot.playerNotion,
        movePath: [robot.planetId],
      };
      continue;
    }

    existing.levels = robot.levels;
    existing.movePath.push(robot.planetId);
  }

  const robotIds = robots.map((r) => r.robotId);
  const oldRobotIds = Object.keys(spottedRobots).filter(
    (s) => !robotIds.includes(s)
  );
  for (const oldRobot of oldRobotIds) {
    delete spottedRobots[oldRobot];
  }
}

export function getNotion(id: string) {
  return id.substring(0, 8);
}

export function clear() {
  spottedRobots = {};
}

export function getOnPlanet(id: string): SpottedRobot[] {
  return Object.values(spottedRobots).filter(
    (s) => s.movePath[s.movePath.length - 1] === id
  );
}
