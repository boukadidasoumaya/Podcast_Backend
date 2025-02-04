import { Controller, Post, Delete, Get, Param } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { CurrentUser } from 'src/shared/Decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}
  @UseGuards(JwtAuthGuard)

  @Post(':episodeId')
  async addBookmark(@CurrentUser() user: User, @Param('episodeId') episodeId: number) {
    return this.bookmarkService.addBookmark(user.id, episodeId);
  }
  @UseGuards(JwtAuthGuard)

  @Delete(':episodeId')
  async removeBookmark(@CurrentUser() user: User, @Param('episodeId') episodeId: number) {
    return this.bookmarkService.removeBookmark(user.id, episodeId);
  }

 
  @UseGuards(JwtAuthGuard)
  @Get('/user')

  async getUserBookmarks(@CurrentUser() user: User) {
    console.log(user)
    return this.bookmarkService.getUserBookmarks(user.id);
  }
  @UseGuards(JwtAuthGuard)

  @Get(':episodeId')
  async isBookmarked(@CurrentUser() user: User, @Param('episodeId') episodeId: number) {
    return this.bookmarkService.isBookmarked(user.id, episodeId);
  }
}
