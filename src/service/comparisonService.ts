import OpenAIManager from '../helpers/gptClient';

type Message = {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
};

// TODO take an answer object that has the user's name
export async function compare(
  question: string,
  answer1: string,
  answer2: string,
): Promise<string> {
  const prompt = `
    I have the following ice-breaker question to help new starters in a remote company get to know their team mates better:

    \`\`\`
    "${question}"
    \`\`\`

    Please compare these two answers and draw any interesting or insightful links OR interesting differences. Please constrain this comparison to no more than 140 characters and mention their names.

    \`\`\`
    ${answer1}

    ${answer2}
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

/**
 * todo
 *   At a set time each day, pull the answers from the database.
 *   Generate a comparison via chatGPT between a new team member and everyone in the team.
 *   Persist the comparison in the db.
 */
