/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsOptional, IsString } from 'class-validator';

export class TextToAudioDto {
  @IsString()
  readonly prompt: string;

  @IsString()
  @IsOptional()
  readonly voice?: string;
}
