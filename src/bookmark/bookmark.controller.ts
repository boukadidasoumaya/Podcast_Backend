import { Controller, Post, Delete, Param } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';

@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  // Create a new bookmark
  @Post(':userId/:episodeId')
  async createBookmark(
    @Param('userId') userId: number,
    @Param('episodeId') episodeId: number,
  ) {
    const createBookmarkDto = {
      userId,
      episodeId,
    };
    return this.bookmarkService.createBookmark(createBookmarkDto);
  }

  // Delete a bookmark
  @Delete(':userId/:episodeId')
  async removeBookmark(
    @Param('userId') userId: number,
    @Param('episodeId') episodeId: number,
  ) {
    return this.bookmarkService.removeBookmark(userId, episodeId);
  }
}
