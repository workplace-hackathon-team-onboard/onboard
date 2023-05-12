import OpenAIManager from '../helpers/gptClient';

type Message = {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
};

// TODO take an answer object that has the user's name
export async function compare(
  answer1: string,
  answer2: string,
): Promise<string> {
  const prompt = `
    Please compare these two answers and draw any interesting or insightful links OR interesting differences. Please constrain this comparison to no more than 140 characters.

    ${answer1}

    ${answer2}
  `;

  const message: Message = {
    role: 'user',
    content: prompt,
  };

  const openai = await OpenAIManager.getInstance();

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [message],
    stream: true,
  });

  const comparison = response.data.choices[0].message.content;

  return comparison;
}
