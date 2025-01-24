import { IsString, IsBoolean, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEpisodeDto {
  @ApiProperty({
    description: 'Name of the episode',
    example: 'Introduction to AI',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Description of the episode',
    example: 'Lorem Ipsum',
  })
  @IsString()
  @IsNotEmpty()
  description: string; // Name of the episode

  @ApiProperty({
    description: 'Episode number in the series',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  number: number;


  @ApiProperty({
    description: 'Duration of the episode in seconds',
    example: 3600,
  })
  @IsNumber()
  @IsNotEmpty()
  duration: number; // Duration of the episode in seconds

  @ApiProperty({
    description: 'Filepath to the episode file',
    example: '/uploads/episodes/introduction-to-ai.mp3',
  })
  @IsString()
  @IsNotEmpty()
  coverImage: string; // Filepath to the episode file
}
