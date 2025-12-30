/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString } from 'class-validator';

export class TranslateDto {
  @IsString()
  readonly prompt: string;

  @IsString()
  readonly lang: string;
}
