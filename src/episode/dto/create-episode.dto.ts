import { IsString, IsBoolean, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
    description: 'Indicates if the episode is premium content',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  premium: boolean; // This property is not in the entity but you can keep it for logic purposes

  @ApiProperty({
    description: 'Duration of the episode in seconds',
    example: 3600,
  })
  @IsNumber()
  @IsNotEmpty()
  duration: number; // Duration in seconds (this matches the 'duration' column in the entity)

  @ApiProperty({
    description: 'Filepath to the episode file',
    example: '/uploads/episodes/introduction-to-ai.mp3',
  })
  @IsString()
  @IsNotEmpty()
  filepath: string; // Filepath to the episode file (this matches the 'filepath' column in the entity)

  @ApiProperty({
    description: 'Podcast ID the episode belongs to',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  podcastId: number; // Added for the relation to Podcast (corresponds to 'podcast' field in the entity)
}
