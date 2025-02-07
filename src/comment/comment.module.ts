import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentGateway } from './comment.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Podcast } from '../podcast/entities/podcast.entity';
import { Episode } from '../episode/entities/episode.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { PodcastModule } from '../podcast/podcast.module';
import { EpisodeModule } from '../episode/episode.module';
import { LikeComment } from '../like-comment/entities/like-comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, User, Podcast, Episode,LikeComment]),
    UserModule, 
    PodcastModule, 
    EpisodeModule, 
  ],
  providers: [CommentGateway, CommentService],
  exports: [CommentService],
})
export class CommentModule {}
