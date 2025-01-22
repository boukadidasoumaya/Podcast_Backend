import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '../../user/entities/user.entity';
export class DeleteCommentDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
  @Type(() => User)
  user: User;
}
