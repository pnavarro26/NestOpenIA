/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsOptional, IsString } from 'class-validator';

export class AudioToText {
  @IsString()
  @IsOptional()
  readonly prompt?: string;
}
