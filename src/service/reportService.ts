import {prisma} from "../helpers/prismaClient";

export const generateReport = async () => {
  const comparisons = await prisma.comparison.findMany();

  for (let comparison of comparisons) {
    console.log(comparison);
  }

  /**
   * todo
   *   At a set time each day, pull the comparison reports from the database.
   *   Format the reports into a readable format.
   *   Post the reports into the team Slack channel.
   */
}
