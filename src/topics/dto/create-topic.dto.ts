import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreatetopicDto  {
  @ApiProperty({
    description: 'The title of the topic',
    example: 'Tech Podcasts',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The image URL for the topic',
    example: 'https://example.com/image.jpg',
  })
  @IsNotEmpty()
  @IsString()
  image: string;

 
}