import { Injectable } from '@nestjs/common';
import { PromptTemplate } from 'langchain/prompts';
import { CreatePackageJsonCommandDto } from './dtos/CreatePackageJsonCommand.dto';
import { LLMChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { llm } from 'src/lib/llm';

const createCommandTemplate = new PromptTemplate({
  template:
    'Escreva um comando para um arquivo package.json em um software nest.js. instruções: {commandText}\n\nSem comentários. Responda apenas com um json válido, onde a key é o nome do comando, e o value é o comando a ser executado.\n\n\n',
  inputVariables: ['commandText'],
});

@Injectable()
export class PackageJsonCommand {
  async createPackageJsonCommand(command: CreatePackageJsonCommandDto) {
    const chain = new LLMChain({
      llm: llm.getLLM(),
      prompt: createCommandTemplate,
    });
    const prompt = await chain.call({
      commandText: command.message,
    });
    return JSON.parse(`{${prompt.text}}`);
  }
}
