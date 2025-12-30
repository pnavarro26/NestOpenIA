/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { GoogleGenAI } from '@google/genai';

interface Options {
  prompt: string;
  lang: string;
}

interface Models {
  model?: string;
}

export const translateUseCase = async (
  ai: GoogleGenAI,
  { prompt, lang }: Options,
  modelOption?: Models,
) => {
  const { model = 'gemini-2.5-flash' } = modelOption || {};

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const response = await ai.models.generateContent({
    model: model,
    contents: prompt, // prompt
    config: {
      responseMimeType: 'application/json',
      systemInstruction: `
      Traduce el siguiente texto al idioma ${lang}:${prompt}`,
    },
  });

  return response.text;
};
