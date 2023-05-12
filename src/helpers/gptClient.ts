import { Configuration, OpenAIApi } from 'openai';

class OpenAIManager {
  private static instance: OpenAIApi;

  private constructor() {}

  public static getInstance(): OpenAIApi {
    if (!OpenAIManager.instance) {
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      OpenAIManager.instance = new OpenAIApi(configuration);
    }
    return OpenAIManager.instance;
  }
}

export default OpenAIManager;
