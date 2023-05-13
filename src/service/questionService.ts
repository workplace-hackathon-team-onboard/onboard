import {prisma} from "../helpers/prismaClient";
import {getSlackUserByEmail, sendQA} from "../slack-bot";

type QuestionId = number;
type UserId = number;
/**
 * Keep track of the last question asked to a user
 */
const askedQuestions: Record<UserId, QuestionId> = {}

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
      if (unansweredQuestion.id === askedQuestions[user.id]) {
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

askQuestions();
