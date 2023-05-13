import {prisma} from "../helpers/prismaClient";
import {Question} from "@prisma/client";


export const getNextUnansweredQuestion = async (userId: number): Promise<Question | undefined> => {

  const questions = await prisma.question.findMany();

  const answeredQuestions = await prisma.answer.findMany({
    orderBy: {
      id: 'asc'
    },
    where: {
      userId: userId
    }
  });

  const answeredQuestionIds = answeredQuestions.map(answer => answer.questionId);

  const unansweredQuestion = questions
    .find(question => !answeredQuestionIds.includes(question.id));


  console.log('unanswered', questions, answeredQuestions, unansweredQuestion)

  return unansweredQuestion;
}

