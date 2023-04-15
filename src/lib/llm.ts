import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'langchain/llms/openai';

class LLM {
  openai?: OpenAI;

  constructor() { }

  getLLM(): OpenAI {
    if (!this.openai) {
      this.openai = new OpenAI({
        temperature: 0.9,
      });
    }
    return this.openai;
  }
}

export const llm = new LLM();
