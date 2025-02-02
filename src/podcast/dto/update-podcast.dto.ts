import { PartialType } from '@nestjs/swagger';
import { CreatePodcastDto } from './create-podcast.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePodcastDto extends PartialType(CreatePodcastDto) {
    @IsOptional()
      @IsString()
      topic: string;
    
}
