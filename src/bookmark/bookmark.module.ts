import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { Bookmark } from './entities/bookmark.entity';
import { User } from 'src/user/entities/user.entity';
import { Episode } from 'src/episode/entities/episode.entity';
@Module({
    imports: [TypeOrmModule.forFeature([Bookmark,User,Episode])],
    providers: [BookmarkService],
    controllers: [BookmarkController],})
export class BookmarkModule {}
