import { IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '../../user/entities/user.entity';
import { Comment } from '../../comment/entities/comment.entity';

export class CreateLikeCommentDto {
  @Type(() => User)
  @IsNotEmpty()
  user: User;

  @Type(() => Comment)
  @IsNotEmpty()
  comment: Comment;
}
