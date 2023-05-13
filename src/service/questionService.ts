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

  const questions = await prisma.question.findMany();

  const answeredQuestions = await prisma.answer.findMany({where: {userId: userId}});

  const answeredQuestionIds = answeredQuestions.map(answer => answer.questionId);

  const unansweredQuestion = questions
    .find(question => !answeredQuestionIds.includes(question.id));


  console.log('unanswered', questions, answeredQuestions, unansweredQuestion)

  return unansweredQuestion;
}

