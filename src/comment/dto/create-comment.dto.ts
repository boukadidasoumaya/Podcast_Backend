import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Podcast } from '../../podcast/entities/podcast.entity';
import { User } from '../../user/entities/user.entity';
import { Comment } from '../entities/comment.entity';
import { Episode } from '../../episode/entities/episode.entity';

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
  readonly podcast: Podcast;



  @ApiPropertyOptional({
    description: 'ID of the parent comment (for nested comments)',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  readonly parent?: Comment;

  @ApiPropertyOptional({
    description: 'ID of the episode being commented on (if applicable)',
    example: 1,
  })
  @IsNumber()
  readonly episode?: Episode;
}
