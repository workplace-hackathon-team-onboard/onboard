import {prisma} from "../helpers/prismaClient";
import {sendQA} from "../slack-bot";

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
    //
    // sendQA({
    //   slackUserId: user.slackUserId,
    //   questions: [{
    //     questionId: unansweredQuestion.id,
    //     question: unansweredQuestion.question
    //   }]
    // })
  }

}

askQuestions();
