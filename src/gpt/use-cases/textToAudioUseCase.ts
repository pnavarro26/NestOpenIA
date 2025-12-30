/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import * as path from 'path';
import * as fs from 'fs';
import wav from 'wav';

import { GoogleGenAI } from '@google/genai';

interface Options {
  prompt: string;
  voice?: string;
}

interface Models {
  model?: string;
}

async function saveWaveFile(
  filename,
  pcmData,
  channels = 1,
  rate = 24000,
  sampleWidth = 2,
) {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const writer = new wav.FileWriter(filename, {
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    // ********************************************************************
    // El archivo WAV se escribe de forma asíncrona
    // La promesa se resuelve cuando termina correctamente
    // ********************************************************************
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    writer.on('finish', resolve);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    writer.on('error', reject);

    // ********************************************************************
    // Escribe los bytes PCM
    // ********************************************************************
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    writer.write(pcmData);

    // ********************************************************************
    // Cierra el archivo
    // ********************************************************************
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    writer.end();
  });
}

export const textToAudioUseCase = async (
  ai: GoogleGenAI,
  { prompt, voice }: Options,
  modelOption?: Models,
) => {
  const { model = 'gemini-2.5-flash-preview-tts' } = modelOption || {};

  const dir = path.join(__dirname, '..', 'generated', 'audios');

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  console.log(dir);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const response = await ai.models.generateContent({
    model: model,
    contents: [{ parts: [{ text: 'Hola, como estas?' }] }], //contents: prompt, // prompt
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  // ********************************************************************
  // Extrae el audio
  // Viene en Base64
  // Formato: PCM
  // ********************************************************************

  const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData
    ?.data as string;

  if (!data) {
    throw new Error('No se recibió audio en la respuesta de Gemini');
  }
  // ********************************************************************
  //Convierte Base64 en bytes reales
  // ********************************************************************
  const audioBuffer = Buffer.from(data, 'base64');

  const fileName = 'out.wav';
  const filePath = path.join(dir, fileName);

  // ********************************************************************
  //Envuelve el PCM en WAV
  //Guarda un archivo reproducible
  // Nombre final: out.wav
  // ********************************************************************
  await saveWaveFile(filePath, audioBuffer);

  // retorna el path completo donde se genero el audio
  return filePath;
};
