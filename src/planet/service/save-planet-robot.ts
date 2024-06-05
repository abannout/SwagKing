import { PlanetDependencies } from "../../common/dependencies/planet-dependency.js";

export default function makeSavePlanetForRobot({
  planetRepo,
}: PlanetDependencies) {
  return async (robotId: string, planetId: string) => {
    await planetRepo.savePlanetForRobot(robotId, planetId);
  };
}
