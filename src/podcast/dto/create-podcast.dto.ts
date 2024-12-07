/* eslint-disable prettier/prettier */
import { IsString, IsOptional, IsUrl } from 'class-validator';

export class CreatePodcastDto {
  @IsString()
  name: string;

  @IsString()
  duration: string;

  @IsString()
  description: string;

  /*@IsUrl()
  @IsOptional()
  image?: string;*/
}
