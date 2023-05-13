import {prisma} from "../helpers/prismaClient";
import {getSlackUserByEmail, sendQA} from "../slack-bot";

const askedQuestions: Record<string, number> = {}

export const askQuestions = async () => {
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

    if (!slackUser) {
      await sendQA({
        slackUserId: slackUser.id,
        questions: [{
          questionId: unansweredQuestion.id,
          question: unansweredQuestion.question
        }]
      })

    } else {
      console.error('could not find slack user for email', user)
    }

  }

}

askQuestions();
