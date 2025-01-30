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
    description: 'topic of the podcast',
    example: 'Education Health .',
  })
  @IsString()
  topic :string;

  @ApiProperty({
    description: 'Description of the podcast',
    example: 'A podcast about the latest in technology and innovation.',
  })
  @IsString()
  description: string;
  @IsOptional()
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'image',
    required: false,
  })
  image: string;

  @ApiProperty({
    description: 'Number of episodes in the podcast',
    example: 10,
  })
  
  @IsNumber()
  nbre_episode: number;



}
