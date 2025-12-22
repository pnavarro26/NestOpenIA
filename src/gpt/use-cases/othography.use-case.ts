/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { GoogleGenAI } from '@google/genai';

interface Options {
  promt: string;
}

interface Models {
  model?: string;
}

export const othographyCheckUseCase = async (
  ai: GoogleGenAI,
  options: Options,
  modelOption?: Models,
) => {
  const { promt } = options;

  const { model = 'gemini-2.5-flash' } = modelOption || {};

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const response = await ai.models.generateContent({
    model: model,
    contents: promt, // promt
    config: {
      responseMimeType: 'application/json',
      systemInstruction: `
      Te será proveedídos textos en español que pueden contener errores ortográficos.
      Tu tarea es identificar y corregir estos errores, proporcionando la versión corregida del texto.
      Las palabras usadas deben de existir en el diccionario de la Real Academia Española (RAE).
      Asegúrate de mantener el significado original del texto mientras corriges los errores ortográficos.
      Responde únicamente con el texto corregido, sin explicaciones adicionales o comentarios.
      Si no hay errores ortográficos en el texto proporcionado, debes retornar un mensaje de felicitación.
      Debes responder en formato JSON de la siguiente manera:
      {
        "correctedText": "Aquí va el texto corregido sin errores ortográficos.",
        "errors": [
          {
            "original": "palabra con error",
            "correction": "palabra corregida",
            "position": 15 // posición de la palabra con error en el texto original
          }
        ],
        "message": "Felicidades, no se encontraron errores ortográficos." // Este campo es opcional y solo se incluye si no hay errores.
    } 
          `,
    },
  });
  //console.log(ai);
  //console.log(response.text);

  // Limpieza de la respuesta para quitar los backticks
  //   const cleanText = response.text
  //     ? response.text.replace(/```json\n?/, '').replace(/```/, '')
  //     : '';

  // Parseo seguro
  //const JSONResponse = JSON.parse(response);

  return response.text;
};
