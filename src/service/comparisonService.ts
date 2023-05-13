import {Answer, User} from '@prisma/client';
import OpenAIManager from '../helpers/gptClient';
import { prisma } from '../helpers/prismaClient';

type Message = {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
};

// TODO take an answer object that has the user's name
export async function compare(
  question: string,
  name1: string,
  answer1: string,
  name2: string,
  answer2: string,
): Promise<string> {
  const prompt = `
    I have the following ice-breaker question to help new starters in a remote company get to know their team mates better:

    \`\`\`
    "${question}"
    \`\`\`

    Please compare these two answers and draw any interesting or insightful links OR interesting differences. Please constrain this comparison to no more than 140 characters and mention their names.

    \`\`\`
    ${name1}:${answer1}

    ${name2}:${answer2}
    \`\`\`

    Please compare these two answers and draw any interesting or insightful links OR interesting differences. Please constrain this comparison to no more than 140 characters and mention their names.
  `;

  const message: Message = {
    role: 'user',
    content: prompt,
  };

  const openai = await OpenAIManager.getInstance();

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [message],
  });

  const comparison = response.data.choices[0].message.content;

  return comparison;
}

export const generateComparison = async (newAnswer: Answer, prismaUser: User) => {
  const question = await prisma.question.findFirst({
    include: {
      Answer: {
        include: {
          User: true,
        },
      },
    },
    where: { id: newAnswer.questionId },
  });

  const teamAnswers = question.Answer;

  for (let answer of teamAnswers) {
    if (answer.userId !== newAnswer.userId) {
      const comparison = await compare(
        question.question,
        prismaUser.name,
        newAnswer.answer,
        answer.User.name,
        answer.answer,
      );

      await prisma.comparison.create({
        data: {
          userId: answer.userId,
          report: comparison,
          newStarterName: prismaUser.name,
          teamMemberName: answer.User.name,
          questionId: answer.questionId,
          createdAt: new Date(),
        },
      });
    }
  }
};
