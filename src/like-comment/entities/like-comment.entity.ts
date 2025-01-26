import { TimestampEntities } from 'src/Generics/timestamp.entities';
import { User } from 'src/user/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import {Comment} from '../../comment/entities/comment.entity';

@Entity('like-comment')
export class LikeComment extends TimestampEntities{
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user) => user.likesComment)
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.likesComment)
  comment: Comment;
}
