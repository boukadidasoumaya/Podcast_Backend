import { Controller, Post, Delete, Get, Param } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';

@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post(':userId/:episodeId')
  async addBookmark(@Param('userId') userId: number, @Param('episodeId') episodeId: number) {
    return this.bookmarkService.addBookmark(userId, episodeId);
  }

  @Delete(':userId/:episodeId')
  async removeBookmark(@Param('userId') userId: number, @Param('episodeId') episodeId: number) {
    return this.bookmarkService.removeBookmark(userId, episodeId);
  }

  @Get('/user/:userId')
  async getUserBookmarks(@Param('userId') userId: number) {
    return this.bookmarkService.getUserBookmarks(userId);
  }

  @Get(':userId/:episodeId')
  async isBookmarked(@Param('userId') userId: number, @Param('episodeId') episodeId: number) {
    return this.bookmarkService.isBookmarked(userId, episodeId);
  }
}
