/* eslint-disable prettier/prettier */
import { IsString, IsOptional, IsUrl, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { User } from '../../user/entities/user.entity';
import { Topic } from 'src/topics/entities/topic.entity';

export class CreatePodcastDto {
  @ApiProperty({
    description: 'Name of the podcast',
    example: 'Tech Talk',
  })
  @IsString()
  name: string;

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


  @IsNotEmpty()
  @IsString()
  topic: string;



}