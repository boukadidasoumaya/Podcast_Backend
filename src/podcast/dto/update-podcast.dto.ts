import { PartialType } from '@nestjs/swagger';
import { CreatePodcastDto } from './create-podcast.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdatePodcastDto extends PartialType(CreatePodcastDto) {

  @IsOptional()
  @IsNumber()
  views: number;

  @IsOptional()
  @IsNumber()
  rating: number;

  @IsOptional()
  @IsNumber()
  download_Count: number;

  
}
