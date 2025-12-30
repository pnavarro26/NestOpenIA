/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// import * as path from 'path';
// import * as fs from 'fs';
// import wav from 'wav';

import {
  createPartFromUri,
  createUserContent,
  GoogleGenAI,
  Type,
} from '@google/genai';

interface Options {
  prompt?: string;
  audioFile: Express.Multer.File;
}

interface Models {
  model?: string;
}

// async function saveWaveFile(
//   filename,
//   pcmData,
//   channels = 1,
//   rate = 24000,
//   sampleWidth = 2,
// ) {
//   return new Promise((resolve, reject) => {
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-call
//     const writer = new wav.FileWriter(filename, {
//       channels,
//       sampleRate: rate,
//       bitDepth: sampleWidth * 8,
//     });

//     // ********************************************************************
//     // El archivo WAV se escribe de forma asíncrona
//     // La promesa se resuelve cuando termina correctamente
//     // ********************************************************************
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-call
//     writer.on('finish', resolve);
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-call
//     writer.on('error', reject);

//     // ********************************************************************
//     // Escribe los bytes PCM
//     // ********************************************************************
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-call
//     writer.write(pcmData);

//     // ********************************************************************
//     // Cierra el archivo
//     // ********************************************************************
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-call
//     writer.end();
//   });
// }

export const audioToTextUseCase = async (
  ai: GoogleGenAI,
  { prompt, audioFile }: Options,
  modelOption?: Models,
) => {
  console.log(prompt);
  console.log(audioFile);
  console.log(modelOption);

  const { model = 'gemini-2.5-flash' } = modelOption || {};

  // const prompt2 = `
  //   Procesar el archivo de audio y generar una transcripción detallada.

  //   Requisitos:
  //   1. Identificar a los distintos hablantes (p. ej., Hablante 1, Hablante 2 o nombres si el contexto lo permite).
  //   2. Proporcionar marcas de tiempo precisas para cada segmento (Formato: MM:SS).
  //   3. Identificar el idioma principal de cada segmento.
  //   4. Si el segmento está en un idioma diferente al español, proporcionar también la traducción al español.
  //   5. Identificar la emoción principal del hablante en este segmento. Debe elegir exactamente una de las siguientes: Feliz, Triste, Enojado, Neutral.
  //   6. Proporcionar un breve resumen de todo el audio al principio.
  //   `;

  const Emotion = {
    Happy: 'happy',
    Sad: 'sad',
    Angry: 'angry',
    Neutral: 'neutral',
  };

  // const dir = path.join(__dirname, '..', 'generated', 'audios');

  // if (!fs.existsSync(dir)) {
  //   fs.mkdirSync(dir, { recursive: true });
  // }

  // console.log(dir);

  const myfile = await ai.files.upload({
    file: audioFile.path,
    config: { mimeType: 'audio/mp4' },
  });

  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        {
          fileData: {
            fileUri: myfile.uri,
          },
        },
        {
          text: prompt,
        },
      ],
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: {
            type: Type.STRING,
            description: 'un resumen conciso del audio.',
          },
          segments: {
            type: Type.ARRAY,
            description:
              'Lista de segmentos transcritos con hablante y marca de tiempo.',
            items: {
              type: Type.OBJECT,
              properties: {
                speaker: { type: Type.STRING },
                timestamp: { type: Type.STRING },
                content: { type: Type.STRING },
                language: { type: Type.STRING },
                language_code: { type: Type.STRING },
                translation: { type: Type.STRING },
                emotion: {
                  type: Type.STRING,
                  enum: Object.values(Emotion),
                },
              },
              required: [
                'speaker',
                'timestamp',
                'content',
                'language',
                'language_code',
                'emotion',
              ],
            },
          },
        },
        required: ['summary', 'segments'],
      },
    },
  });
  const json = JSON.parse(response.text!);
  console.log(json);
  // contents: createUserContent([
  //   createPartFromUri(myfile.uri!, myfile.mimeType!),
  //   'Describe este audio en español',
  // ]),

  return json;
};
