import { Body, Controller, Post } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OthographyDto } from './dtos';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('otthography-check')
  checkOthography(@Body() orthographyDto: OthographyDto) {
    return this.gptService.checkOthography(orthographyDto);
  }
}
