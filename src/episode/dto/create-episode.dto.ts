import { IsString, IsBoolean, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEpisodeDto {
  @ApiProperty({
    description: 'Name of the episode',
    example: 'Introduction to AI',
  })
  @IsString()
  @IsNotEmpty()
  Title: string; // Name of the episode

  @ApiProperty({
    description: 'Episode number in the series',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  number: number; // Episode number

  @ApiProperty({
    description: 'Indicates if the episode is premium content',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  premium: boolean; // Whether the episode is premium

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
  filepath: string; // Filepath to the episode file
}
