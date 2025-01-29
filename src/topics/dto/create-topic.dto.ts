import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreatetopicDto  {
    @ApiProperty({ example: 'Technology', description: 'Title of the topic' })
    @IsNotEmpty()
    @IsString()
    title: string;
  
    @ApiProperty({ example: 10, description: 'Number of episodes' })
    @IsNotEmpty()
    @IsNumber()
    episodes: number;
  
    @ApiProperty({ example: 'https://example.com/image.jpg', description: 'Image URL' })
    @IsNotEmpty()
    @IsString()
    image: string;
  }