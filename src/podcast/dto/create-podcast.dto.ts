/* eslint-disable prettier/prettier */
import { IsString, IsOptional, IsUrl, IsNumber } from 'class-validator';

export class CreatePodcastDto {
  @IsString()
  name: string;

  @IsString()
  duration: string;

  @IsString()
  description: string;
  
  @IsNumber()
  nbre_episode: number;


  /*@IsUrl()
  @IsOptional()
  image?: string;*/
}
