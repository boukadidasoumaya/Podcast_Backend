import { Module } from '@nestjs/common';
import { LikeCommentService } from './like-comment.service';
import { LikeCommentController } from './like-comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { LikeComment } from './entities/like-comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LikeComment, User])],

  providers: [LikeCommentService],
  controllers: [LikeCommentController],
})
export class LikeCommentModule {}
