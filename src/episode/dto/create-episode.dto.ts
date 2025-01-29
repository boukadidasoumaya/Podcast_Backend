import { IsString, IsBoolean, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Podcast } from '../../podcast/entities/podcast.entity';

export class CreateEpisodeDto {
  @ApiProperty({
    description: 'Name of the episode',
    example: 'Introduction to AI',
  })
  @IsString()
  @IsNotEmpty()
  name: string; // Name of the episode (this matches the 'name' column in the entity)

  @ApiProperty({
    description: 'Episode number in the series',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  number: number; // Episode number (this matches the 'number' column in the entity)

  @ApiProperty({
    description: 'Duration of the episode in seconds',
    example: 3600,
  })
  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @ApiProperty({
    description: 'Filepath to the episode file',
    example: '/uploads/episodes/introduction-to-ai.mp3',
  })
  @IsString()
  @IsNotEmpty()
  coverImage: string; // Filepath to the episode file (this matches the 'filepath' column in the entity)


  @ApiProperty({
    description: 'Podcast',
    example: 1,
  })
  @IsNotEmpty()
  @Type(() => Podcast)
  podcast: Podcast;

}
