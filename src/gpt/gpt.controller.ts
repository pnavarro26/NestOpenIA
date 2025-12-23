/* eslint-disable @typescript-eslint/await-thenable */
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import type { Response } from 'express';

import { GptService } from './gpt.service';
import { OthographyDto, ProsConsDiscusserDto } from './dtos';

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
}
