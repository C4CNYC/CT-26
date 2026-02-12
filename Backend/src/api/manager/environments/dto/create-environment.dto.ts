import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Express } from 'express';

export class CreateEnvironmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  style?: string;

  @IsString()
  @IsOptional()
  script?: string;

  @IsOptional()
  file?: Express.Multer.File;
}
