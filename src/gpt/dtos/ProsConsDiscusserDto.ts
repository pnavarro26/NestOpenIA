/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString } from 'class-validator';

export class ProsConsDiscusserDto {
  @IsString()
  readonly prompt: string;
}
