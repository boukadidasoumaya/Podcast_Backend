import { Controller, Get, Param, Body, Post, Patch, Delete, Req } from '@nestjs/common';
import { Request } from 'express';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Controller('comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly userService: UserService,
  ) {}



  @Post('create')
  async create(@Body() createCommentDto: CreateCommentDto, @Req() req: Request) {
    const userId = req['userId'];  // Récupérer l'ID de l'utilisateur de la requête (par exemple après l'authentification)
    const currentUser: User = await this.userService.findOne(userId);

    console.log(createCommentDto);  // Vérifiez si les données arrivent ici

    return this.commentService.create(createCommentDto, currentUser); 
  }

  @Get('get/:id')
  async findOne(@Param('id') id: number, @Req() req: Request) {
    const userId = req['userId'];
    return this.commentService.findOneByUser(id,userId); 
  }

  @Patch('update/:id')
  async update(@Param('id') id: number, @Body() updateCommentDto: UpdateCommentDto, @Req() req: Request) {
    const userId = req['userId'];
    const currentUser = await this.userService.findOne(userId); 
    return this.commentService.update(id, updateCommentDto, currentUser); 
  }

  @Delete('remove/:id')
  async remove(@Param('id') id: number, @Req() req: Request) {
    const userId = req['userId'];
    const currentUser = await this.userService.findOne(userId); 
    return this.commentService.remove(id, currentUser); 
  }
}
