/* eslint-disable prettier/prettier */
import { IsString, IsOptional, IsUrl, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { User } from '../../user/entities/user.entity';

export class CreatePodcastDto {
  @ApiProperty({
    description: 'Name of the podcast',
    example: 'Tech Talk',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Duration of the podcast (e.g., HH:MM:SS)',
    example: '01:30:45',
  })
  @IsString()
  duration: string;

  @ApiProperty({
    description: 'Description of the podcast',
    example: 'A podcast about the latest in technology and innovation.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Number of episodes in the podcast',
    example: 10,
  })
  @IsNumber()
  nbre_episode: number;

  @ApiPropertyOptional({
    description: 'URL of the podcast image',
    example: 'https://example.com/podcast-image.jpg',
  })
  @IsUrl()
  @IsOptional()
  image?: string;
  @ApiProperty({
  description: 'Owner of the podcast',
  example: 1,
  })
  @IsNotEmpty()
  @Type(() => User)
  user: User;

}
