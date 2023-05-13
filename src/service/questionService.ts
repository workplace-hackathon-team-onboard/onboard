import {prisma} from "../helpers/prismaClient";
import {getSlackUserByEmail, sendQA} from "../slack-bot";
import {Question} from "@prisma/client";

type QuestionId = number;
type UserId = number;
/**
 * Keep track of the last question asked to a user
 */
const askedQuestions: Record<UserId, QuestionId> = {}

export const getNextUnansweredQuestion = async (userId: UserId): Promise<Question  | undefined> => {
  const unansweredQuestions = await prisma.question.findMany({
    where: {
      Answer: {
        none: {
          userId: userId
        }
      }
    }
  })

  console.log('unanswered', unansweredQuestions)

  if (unansweredQuestions && unansweredQuestions.length > 0) {
    return unansweredQuestions[0]
  }

  return undefined;
}

