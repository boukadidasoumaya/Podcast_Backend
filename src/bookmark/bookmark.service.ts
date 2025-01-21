import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { Bookmark } from './entities/bookmark.entity';
import { User } from '../user/entities/user.entity';
import { Episode } from '../episode/entities/episode.entity';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Episode)
    private readonly episodeRepository: Repository<Episode>,
  ) {}

  // Create a bookmark
  async createBookmark(createBookmarkDto: CreateBookmarkDto): Promise<Bookmark> {
    // Find the user by userId (number)
    const user = await this.userRepository.findOne({
      where: { id: createBookmarkDto.userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Find the episode by episodeId (number)
    const episode = await this.episodeRepository.findOne({
      where: { id: createBookmarkDto.episodeId },
    });
    if (!episode) {
      throw new NotFoundException('Episode not found');
    }

    // Create the bookmark
    const bookmark = this.bookmarkRepository.create({
      user,
      episode,
    });

    // Save and return the bookmark
    return this.bookmarkRepository.save(bookmark);
  }

  // Delete a bookmark
  async removeBookmark(userId: number, episodeId: number): Promise<void> {
    // Find the bookmark by userId and episodeId (both numbers)
    const bookmark = await this.bookmarkRepository.findOne({
      where: { user: { id: userId }, episode: { id: episodeId } },
    });
    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }

    // Delete the bookmark
    await this.bookmarkRepository.remove(bookmark);
  }}