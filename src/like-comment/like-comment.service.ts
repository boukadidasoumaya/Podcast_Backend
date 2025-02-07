import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { LikeComment } from './entities/like-comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../comment/entities/comment.entity';
import { User } from '../user/entities/user.entity';
import { CreateLikeCommentDto } from './dto/create-like-comment.dto';
import { DeleteLikeCommentDto } from './dto/delete-like-comment.dto';
import { UserService } from '../user/user.service';
import { CommentService } from '../comment/comment.service';

@Injectable()
export class LikeCommentService {
  constructor(
    @InjectRepository(LikeComment)
    private likeCommentRepository: Repository<LikeComment>,
    private userService: UserService,
    private commentService: CommentService,
  ) {}

  async likeComment(
    createLikeCommentDto: CreateLikeCommentDto,
  ): Promise<LikeComment> {
    const { user, comment } = createLikeCommentDto;

    // Vérification si l'utilisateur existe
    const existingUser = await this.userService.findOne(user.id);
    if (!existingUser) {
      throw new NotFoundException("User doesn't exist.");
    }

    // Vérification si le commentaire existe
    const existingComment = await this.commentService.findOne(comment.id);
    if (!existingComment) {
      throw new NotFoundException("Comment doesn't exist.");
    }

    // Vérification si le like existe déjà pour cet utilisateur et ce commentaire
    const existingLike = await this.likeCommentRepository.findOne({
      where: {
        user: { id: user.id },
        comment: { id: comment.id },
      },
    });

    if (existingLike) {
      throw new BadRequestException('You have already liked this comment');
    }

    const like = this.likeCommentRepository.create({
      user: user,
      comment: comment,
    });

    return await this.likeCommentRepository.save(like);
  }

  async unlikeComment(
    deleteLikeCommentDto: DeleteLikeCommentDto,
  ): Promise<void> {
    const { user, comment } = deleteLikeCommentDto;

    const existingLike = await this.likeCommentRepository.findOne({
      where: {
        user: { id: user.id },
        comment: { id: comment.id },
      },
    });

    if (!existingLike) {
      throw new NotFoundException("You haven't liked this comment.");
    }

    await this.likeCommentRepository.delete(existingLike.id);
  }

  async getCommentLikesCount(): Promise<any> {
    const comments = await this.commentService.findAll();

    const commentIds = comments.map((comment) => comment.id);
    const likes = await this.likeCommentRepository
      .createQueryBuilder('like_comment')
      .select(
        'like_comment.commentId, COUNT(like_comment.id) as like_count, like_comment.userId',
      )
      .where('like_comment.commentId IN (:...commentIds)', { commentIds })
      .groupBy('like_comment.commentId, like_comment.userId')
      .getRawMany();

    const commentLikesMap = new Map<
      number,
      { likeCount: number; users: number[] }
    >();

    likes.forEach((like) => {
      if (!commentLikesMap.has(like.commentId)) {
        commentLikesMap.set(like.commentId, { likeCount: 0, users: [] });
      }
      commentLikesMap.get(like.commentId)!.likeCount += Number(like.like_count);
      commentLikesMap.get(like.commentId)!.users.push(like.userId);
    });

    return comments.map((comment) => ({
      comment: comment.id,
      likesCount: commentLikesMap.get(comment.id)?.likeCount || 0,
      users:
        commentLikesMap.get(comment.id)?.users.map((user) => ({ user })) || [],
    }));
  }
}
