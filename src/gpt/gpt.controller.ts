/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/await-thenable */
import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import type { Response } from 'express';

import { GptService } from './gpt.service';
import {
  AudioToText,
  OthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
} from './dtos';
import { TranslateDto } from './dtos/TranslateDto';

// import * as path from 'path';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('otthography-check')
  checkOthography(@Body() orthographyDto: OthographyDto) {
    return this.gptService.checkOthography(orthographyDto);
  }

  @Post('pros-cons-discusser')
  prosConsDicusser(@Body() prosConsDiscusserDto: ProsConsDiscusserDto) {
    return this.gptService.prosConsDicusser(prosConsDiscusserDto);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDicusserStream(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    @Res() res: Response,
  ) {
    const stream = await this.gptService.prosConsDicusser(prosConsDiscusserDto);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    res.setHeader('Content-Type', 'text/plain'); // 'text/event-stream' 'text/plain'
    res.status(HttpStatus.OK);

    if (stream) {
      for await (const chunk of stream) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const piece = chunk;
        console.log(piece);
        res.write(piece);
      }
    }

    res.end();
  }

  @Post('translate')
  translate(@Body() translateDto: TranslateDto) {
    return this.gptService.translate(translateDto);
  }

  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res: Response,
  ) {
    // const filePath = await this.gptService.textToAudio(textToAudioDto);

    // // return await this.gptService.textToAudio(textToAudioDto);

    // console.log(filePath);
    // res.setHeader('Content-Type', 'audio/wav');
    // res.status(HttpStatus.OK);
    // //const stream = fs.createReadStream(filePath);
    // //stream.pipe(res);
    // res.sendFile(filePath);

    try {
      const filePath = await this.gptService.textToAudio(textToAudioDto);
      console.log(filePath);

      if (!filePath || !fs.existsSync(filePath)) {
        console.error('Archivo no encontrado o ruta inválida:', filePath);
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send('Error al generar el audio');
      }

      // res.setHeader('Content-Type', 'audio/wav');
      // res.status(HttpStatus.OK);
      // res.sendFile(filePath);

      const fileBuffer = fs.readFileSync(filePath);
      console.log(fileBuffer);

      res.setHeader('Content-Type', 'audio/wav');
      res.setHeader('Content-Length', fileBuffer.length);
      res.status(HttpStatus.OK).send(fileBuffer);
    } catch (error) {
      console.error('Error en text-to-audio:', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Error interno del servidor');
    }
  }

  @Get('text-to-audio/:fileId')
  textToAudioGetter(@Res() res: Response, @Param('fileId') fileId: string) {
    const fielPath = this.gptService.textToAudioGetter(fileId);

    // const filePath = await this.gptService.textToAudio(textToAudioDto);
    // console.log(filePath);
    res.setHeader('Content-Type', 'audio/wav');
    res.status(HttpStatus.OK);
    res.sendFile(fielPath);
  }

  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      storage: diskStorage({
        destination: './generated/uploads',
        filename(req, file, callback) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${new Date().getTime()}.${fileExtension}`;
          return callback(null, fileName);
        },
      }),
    }),
  )
  AudioToText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1000 * 1024 * 5,
            errorMessage: 'mayor a 5 MB',
          }),

          // new FileTypeValidator({
          //   fileType: 'audio/mp4',
          // }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() audioToText: AudioToText,
  ) {
    console.log(file);
    console.log(audioToText.prompt);

    return this.gptService.audioToText(file, audioToText.prompt);
  }
}
