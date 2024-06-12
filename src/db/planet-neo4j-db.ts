import neo4j from "neo4j-driver"
import logger from "../utils/logger.js"

export const driver = neo4j.driver(
  "neo4j://localhost:7687",
  neo4j.auth.basic("neo4j", "swagkingontop"),
  { disableLosslessIntegers: true }
)

export async function connectToNeo4j() {
  const session = driver.session()
  try {
    await session.run("RETURN TRUE")
    const serverInfo = await driver.getServerInfo()
    logger.info("Sucessfully connected to Neo4j-DB: ", { serverInfo })
  } catch (error) {
    logger.error("Error connecting to Neo4j: ", { error })
    throw error
  } finally {
    await session.close()
  }
}
