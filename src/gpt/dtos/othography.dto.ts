/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsInt, IsOptional, IsString } from 'class-validator';

export class OthographyDto {
  @IsString()
  readonly promt: string;

  @IsInt()
  @IsOptional()
  readonly maxTokens?: number;
}
