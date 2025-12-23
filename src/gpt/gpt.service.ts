import { Injectable } from '@nestjs/common';

import {
  othographyCheckUseCase,
  prosConsDicusserStreamUseCase,
  prosConsDicusserUseCase,
} from './use-cases';
import { OthographyDto, ProsConsDiscusserDto } from './dtos';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GptService {
  // solo va a llmar a los casos de uso //

  // The client gets the API key from the environment variable `GEMINI_API_KEY`.
  private ai = new GoogleGenAI({ apiKey: process.env.GEMENI_API_KEY });

  // Caso de uso de ortografía //
  async checkOthography(orthographyDto: OthographyDto) {
    return othographyCheckUseCase(
      this.ai,
      { promt: orthographyDto.promt },
      { model: 'gemini-2.5-flash' },
    );
  }

  // Caso de uso de pros y contras //
  async prosConsDicusser({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDicusserUseCase(
      this.ai,
      { prompt },
      { model: 'gemini-2.5-flash' },
    );
  }

  // Caso de uso de pros y contras //
  async prosConsDicusserStream({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDicusserStreamUseCase(
      this.ai,
      { prompt },
      { model: 'gemini-2.5-flash' },
    );
  }
}
