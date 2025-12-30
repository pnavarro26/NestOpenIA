import * as path from 'path';
import * as fs from 'fs';

import { Injectable, NotFoundException } from '@nestjs/common';

import {
  audioToTextUseCase,
  othographyCheckUseCase,
  prosConsDicusserStreamUseCase,
  prosConsDicusserUseCase,
  textToAudioUseCase,
} from './use-cases';
import {
  AudioToText,
  OthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
} from './dtos';
import { GoogleGenAI } from '@google/genai';
import { translateUseCase } from './use-cases/translateUseCase';
import { TranslateDto } from './dtos/TranslateDto';

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

  // Caso de uso de ortografía //
  async translate(translateDto: TranslateDto) {
    return translateUseCase(
      this.ai,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      { prompt: translateDto.prompt, lang: translateDto.lang },
      { model: 'gemini-2.5-flash' },
    );
  }

  // Caso de uso de texto a audio //
  async textToAudio(textToAudioDto: TextToAudioDto) {
    return textToAudioUseCase(
      this.ai,
      { prompt: textToAudioDto.prompt, voice: textToAudioDto.voice },
      { model: 'gemini-2.5-flash-preview-tts' },
    );
  }

  textToAudioGetter(fileId: string) {
    //const dir = path.resolve(__dirname, '../../generated/audios/', `${fileId}`);
    const dir = path.join(
      __dirname,
      '..',
      'generated',
      'audios',
      `${fileId}.wav`,
    );
    console.log(dir);

    if (!fs.existsSync(dir)) {
      throw new NotFoundException('No se encontro el archivo');
      //fs.mkdirSync(dir, { recursive: true });
    }

    return dir;
  }

  // Caso de uso de texto a audio //
  audioToText(audioFile: Express.Multer.File, audioToText?: AudioToText) {
    return audioToTextUseCase(
      this.ai,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      { prompt: audioToText?.prompt, audioFile: audioFile },
      { model: 'gemini-2.5-flash' },
    );
  }
}
