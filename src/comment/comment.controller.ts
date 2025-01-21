import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Patch,
  Delete,
  Req, BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { Podcast } from '../podcast/entities/podcast.entity';
import { Episode } from '../episode/entities/episode.entity';

@Controller('comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly userService: UserService,
  ) {}

  @Post('create')
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ) {
    const userId = req['userId'];
    const currentUser: User = await this.userService.findOne(userId);
    return this.commentService.create(createCommentDto, currentUser);
  }

  @Post('all')
  async findAllByEpisode(
    @Body('podcast') podcast: Podcast,
    @Body('episode') episode: Episode
  ) {
    if (!podcast || !episode) {
      throw new BadRequestException(
        "Les objets 'podcast' et 'episode' sont requis dans le body.",
      );
    }

    return this.commentService.findAllByEpisode(podcast, episode);
  }



  @Get('get/:id')
  async findOne(@Param('id') id: number, @Req() req: Request) {
    const userId = req['userId'];
    return this.commentService.findOneByUser(id, userId);
  }

  // @Patch('update/:id')
  // async update(
  //   @Param('id') id: number,
  //   @Body() updateCommentDto: UpdateCommentDto,
  //   @Req() req: Request,
  // ) {
  //   const userId = req['userId'];
  //   const currentUser = await this.userService.findOne(userId);
  //   return this.commentService.update(id, updateCommentDto, currentUser);
  // }

  @Delete('remove/:id')
  async remove(@Param('id') id: number, @Req() req: Request) {
    const userId = req['userId'];
    const currentUser = await this.userService.findOne(userId);
    return this.commentService.softDelete(id, currentUser);
  }
}
