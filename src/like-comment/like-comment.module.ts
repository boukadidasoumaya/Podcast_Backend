import { Module } from '@nestjs/common';
import { LikeCommentService } from './like-comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { LikeComment } from './entities/like-comment.entity';
import { CommentModule } from '../comment/comment.module';
import { UserModule } from '../user/user.module';
import { LikeCommentGateway } from './like-comment.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([LikeComment]),
    CommentModule,
    UserModule,
  ],
  providers: [LikeCommentService, LikeCommentGateway],
})
export class LikeCommentModule {}
