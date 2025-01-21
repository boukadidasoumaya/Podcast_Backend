import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Content of the comment',
    example: 'Great episode!',
  })
  @IsNotEmpty()
  @IsString()
  readonly content: string;

  @ApiProperty({
    description: 'ID of the podcast',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly podcastId: number;

  @ApiProperty({
    description: 'ID of the user making the comment',
    example: 3,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly userId: number;

  @ApiPropertyOptional({
    description: 'ID of the parent comment (for nested comments)',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  readonly parentId?: number;

  @ApiPropertyOptional({
    description: 'ID of the episode being commented on (if applicable)',
    example: 1,
  })
  @IsNumber()
  readonly episodeId?: number;
}
