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

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, User, Podcast, Episode]),
    UserModule, // Ajouté pour résoudre UserService
    PodcastModule, // Ajouté pour résoudre PodcastService
    EpisodeModule, // Ajouté pour résoudre EpisodeService
  ],
  providers: [CommentGateway,CommentService],
})
export class CommentModule {}
