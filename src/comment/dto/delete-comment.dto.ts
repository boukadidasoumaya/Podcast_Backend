import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '../../user/entities/user.entity';
import { Comment } from '../entities/comment.entity';
export class DeleteCommentDto {
  @IsNotEmpty()
  @Type(() => Comment)
  comment: Comment;

  @IsNotEmpty()
  @Type(() => User)
  user: User;
}
