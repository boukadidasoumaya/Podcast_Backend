import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { Episode } from 'src/episode/entities/episode.entity';
import { User } from 'src/user/entities/user.entity';
@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark) private bookmarkRepository: Repository<Bookmark>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Episode) private episodeRepository: Repository<Episode>,
  ) {}

  async addBookmark(userId: number, episodeId: number): Promise<Bookmark> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const episode = await this.episodeRepository.findOne({ where: { id: episodeId } });

    if (!user || !episode) {
      throw new NotFoundException('User or Episode not found');
    }

    const bookmark = this.bookmarkRepository.create({ user, episode });
    return this.bookmarkRepository.save(bookmark);
  }

  async removeBookmark(userId: number, episodeId: number): Promise<void> {
    await this.bookmarkRepository.delete({ user: { id: userId }, episode: { id: episodeId } });
  }

  async getUserBookmarks(userId: number): Promise<Bookmark[]> {
    const episodebookmarked=await this.bookmarkRepository.find({
      where: { user: { id: userId } },
      relations: ["episode" ,'episode.podcast', 'episode.likes', 'episode.comments', 'episode.podcast.user'],
    });
    return episodebookmarked.map((x) => ({
      ...x,
      
      numberOfLikes: x.episode.likes?.length || 0,
      numberOfComments: x.episode.comments?.length || 0,
    }));
  }
  async isBookmarked(userId: number, episodeId: number): Promise<boolean> {
    const bookmark = await this.bookmarkRepository.findOne({
      where: {
        user: { id: userId } as any,
        episode: { id: episodeId } as any,
      },
    });
    console.log(bookmark)
    console.log(bookmark)

    return !!bookmark; // Returns true if a bookmark exists, false otherwise
  }
}
