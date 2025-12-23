/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { GoogleGenAI } from '@google/genai';

interface Options {
  prompt: string;
}

interface Models {
  model?: string;
}

export const prosConsDicusserStreamUseCase = async (
  ai: GoogleGenAI,
  { prompt }: Options,
  modelOption?: Models,
) => {
  const { model = 'gemini-2.5-flash' } = modelOption || {};

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const response = await ai.models.generateContentStream({
    model: model,
    contents: prompt, // prompt
    config: {
      systemInstruction: `
      Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
      la respuesta debe ser únicamente en español
      la respuesta debe de ser en formato markdown,
      los pros y contras deben de estar en una lista,
      asegúrate de que la respuesta sea clara y concisa.`,
    },
  });

  return response;
};
