import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private userService: UserService,
  ) {}

  async create(createCommentDto: CreateCommentDto, user: User) {
    console.log(createCommentDto);
    const newComment = this.commentRepository.create({
      ...createCommentDto,
      user: user,  
    });
    console.log(createCommentDto);

    await this.commentRepository.save(newComment);

    return 'Commentaire créé avec succès';
  }

  async findAll(user: User): Promise<Comment[]> {
    return await this.commentRepository.find({ where: { user: { id: user.id } } });
  }

  async findOne(id: number) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    return comment;
  }

  async findOneByUser(commentId: number, userId: number) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user'],
    });

    if (!comment) {
      throw new NotFoundException(`Commentaire avec l'ID ${commentId} non trouvé`);
    }

    if (comment.user.id !== userId) {
      throw new ForbiddenException("Accès refusé : Vous ne possédez pas ce commentaire");
    }

    return comment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto, user: User): Promise<Comment> {
    const comment = await this.findOne(id);
    const updatedComment = await this.commentRepository.preload({
      id,
      ...updateCommentDto,
    });

    if (!updatedComment) {
      throw new NotFoundException(`Commentaire avec l'ID ${id} non trouvé`);
    }

    if (comment.user?.id === user.id) {
      return await this.commentRepository.save(updatedComment);
    } else {
      throw new UnauthorizedException("Vous n'êtes pas autorisé à mettre à jour ce commentaire");
    }
  }

  async remove(id: number, user: User) {
    const commentToRemove = await this.findOne(id);
    if (!commentToRemove) {
      throw new NotFoundException(`Commentaire avec l'ID ${id} non trouvé`);
    }

    if (commentToRemove.user.id === user.id) {
      return await this.commentRepository.softDelete(id);
    } else {
      throw new UnauthorizedException("Vous n'êtes pas autorisé à supprimer ce commentaire");
    }
  }

  async restore(id: number, user: User) {
    const [comment] = await this.commentRepository.query(
      'SELECT * FROM comment WHERE id = ? LIMIT 1',
      [id],
    );

    if (comment.userId === user.id) {
      return await this.commentRepository.restore(id);
    } else {
      throw new UnauthorizedException("Vous n'êtes pas autorisé à restaurer ce commentaire");
    }
  }

  async findAllForSeeder(): Promise<Comment[]> {
    return await this.commentRepository.find();
  }

  async createForSeeder(comment: Comment): Promise<Comment> {
    return await this.commentRepository.save(comment);
  }
}
