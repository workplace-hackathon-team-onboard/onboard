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

export const askQuestions = async () => {
  console.log('asking questions');
  const nonOnboardedUsers = await prisma.user.findMany({
    where: {
      onboarded: false
    }
  });

  for (let user of nonOnboardedUsers) {
    const unansweredQuestions = await prisma.question.findMany({
      where: {
        Answer: {
          none: {
            userId: user.id
          }
        }
      }
    })

    const unansweredQuestion = unansweredQuestions[0];

    const slackUser = await getSlackUserByEmail(user.email);

    if (slackUser) {
      if (unansweredQuestion.id !== askedQuestions[user.id]) {
        await sendQA({
          slackUserId: slackUser.id,
          questions: [{
            questionId: unansweredQuestion.id,
            question: unansweredQuestion.question
          }]
        })
        askedQuestions[user.id] = unansweredQuestion.id
      } else {
        console.log('already asked this question to this user', user)
      }


    } else {
      console.error('could not find slack user for email', user)
    }

  }

}
