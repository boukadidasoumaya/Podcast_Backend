import { UserService } from 'src/user/user.service';
import { Controller, Get, Param, Body, Post, Delete, Req } from '@nestjs/common';
import { Request } from 'express';
import { LikeService } from './like.service';

@Controller('likes')
export class LikeController {
  constructor(
    private readonly likeService: LikeService,
    private readonly userService:UserService) {}

  // Create a like
  @Post('create')
  async create(@Req() req: Request) {
    const userId = req['userId'];
    const currentUser = await this.userService.findOne(userId); 
    return this.likeService.create(currentUser); 
  }

  // Get all likes of the current user
  @Get('getAll')
  async findAll(@Req() req: Request) {
    const userId = req['userId'];
    const currentUser = await this.userService.findOne(userId); 
    return this.likeService.findAll(currentUser); 
  }

  // Remove a like by ID
  @Delete('remove/:id')
  async remove(@Param('id') id: number, @Req() req: Request) {
    const userId = req['userId'];
    const currentUser = await this.userService.findOne(userId); 
    return this.likeService.remove(id, currentUser); 
  }
}
