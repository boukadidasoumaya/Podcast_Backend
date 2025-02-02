// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Param,
//   Delete,
//   Patch,
// } from '@nestjs/common';
// import { LikeCommentService } from './like-comment.service';
// import { CreateLikeCommentDto } from './dto/create-like-comment.dto';
// import { DeleteLikeCommentDto } from './dto/delete-like-comment.dto';
// import { LikeComment } from './entities/like-comment.entity';
//
// @Controller('like-comment')
// export class LikeCommentController {
//   constructor(private readonly likeCommentService: LikeCommentService) {}
//
//   // Créer un LikeComment
//   @Post()
//   create(
//     @Body() createLikeCommentDto: CreateLikeCommentDto,
//   ): Promise<LikeComment> {
//     return this.likeCommentService.create(createLikeCommentDto);
//   }
//
//   // Récupérer tous les LikeComments
//   @Get()
//   findAll(): Promise<LikeComment[]> {
//     return this.likeCommentService.findAll();
//   }
//
//   // Récupérer un LikeComment par ID
//   @Get(':id')
//   findOne(@Param('id') id: number): Promise<LikeComment> {
//     return this.likeCommentService.findOne(id);
//   }
//
//   // Mettre à jour un LikeComment par ID
//   @Patch(':id')
//   update(
//     @Param('id') id: number,
//     @Body() updateLikeCommentDto: DeleteLikeCommentDto,
//   ): Promise<LikeComment> {
//     return this.likeCommentService.update(id, updateLikeCommentDto);
//   }
//
//   // Supprimer un LikeComment par ID
//   @Delete(':id')
//   remove(@Param('id') id: number) {
//     return this.likeCommentService.remove(id);
//   }
// }
