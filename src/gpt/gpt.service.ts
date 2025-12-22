import { Injectable } from '@nestjs/common';

// import { GoogleGenAI } from '@google/genai';
import { othographyCheckUseCase } from './use-cases';
import { OthographyDto } from './dtos';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GptService {
  // solo va a llmar a los casos de uso //

  // The client gets the API key from the environment variable `GEMINI_API_KEY`.
  private ai = new GoogleGenAI({ apiKey: process.env.GEMENI_API_KEY });

  async checkOthography(orthographyDto: OthographyDto) {
    return othographyCheckUseCase(
      this.ai,
      { promt: orthographyDto.promt },
      { model: 'gemini-2.5-flash' },
    );
  }
}
