import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FindCommentDto } from './dto/find-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { Podcast } from '../podcast/entities/podcast.entity';
import { Episode } from '../episode/entities/episode.entity';
import { EpisodeService } from '../episode/episode.service';
import { PodcastService } from '../podcast/podcast.service';
import { LikeComment } from '../like-comment/entities/like-comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Episode)
    private episodeService: EpisodeService,
    @InjectRepository(Podcast)
    private podcastService: PodcastService,
    @InjectRepository(User)
    private userService: UserService,
    @InjectRepository(LikeComment)
    private likeCommentRepository: Repository<LikeComment>,
  ) {}
  clientToUser: any = {};

  async create(createCommentDto: CreateCommentDto) {
    const newComment = this.commentRepository.create({ ...createCommentDto });
    await this.commentRepository.save(newComment);

    // Récupération du commentaire avec les relations nécessaires
    const comment = await this.commentRepository.findOne({
      where: { id: newComment.id },
      relations: ['parent', 'user', 'podcast', 'episode', 'likesComment.user'],
    });

    if (!comment) {
      throw new NotFoundException(`Commentaire non trouvé après la création.`);
    }
    const likesCount = await this.likeCommentRepository.count({
      where: { comment: { id: comment.id } },
    });
    // Retourner le commentaire formaté comme dans organizeMessages
    return {
      ...comment,
      likesCount,
      user: {
        photo: comment.user.photo,
        username: comment.user.username,
        role: comment.user.role,
        id: comment.user.id,
      },
      replies: [],
    };
  }

  private organizeMessages(messages: any[]): any[] {
    const organizedMessages = [];
    const map = new Map();

    messages.forEach((message) => {
      map.set(message.id, {
        ...message,
        replies: [],
        user: {
          username: message.user.username,
          role: message.user.role,
          id: message.user.id,
          photo: message.user.photo,
        },
      });
    });

    messages.forEach((message) => {
      if (message.parent) {
        const parentMessage = map.get(message.parent.id);
        if (parentMessage) {
          parentMessage.replies.push(map.get(message.id));
        } else {
          organizedMessages.forEach((orgMessage) => {
            if (orgMessage.id === message.parent.id) {
              orgMessage.replies.push(map.get(message.id));
            }
          });
        }
      } else {
        organizedMessages.push(map.get(message.id));
      }
    });

    return organizedMessages;
  }
  async findAllByEpisode(findCommentDto: FindCommentDto): Promise<any[]> {
    const podcast = findCommentDto.podcast;
    const episode = findCommentDto.episode;

    console.log(`Podcast ID: ${podcast.id}, Episode ID: ${episode.id}`);

    // Récupération des commentaires avec les relations nécessaires
    const comments = await this.commentRepository.find({
      where: {
        podcast: { id: podcast.id },
        episode: { id: episode.id }, // Condition pour filtrer par épisode
      },
      relations: ['parent', 'user', 'podcast', 'episode', 'likesComment.user'],
    });

    // Pour chaque commentaire, nous allons compter le nombre de likes
    const commentsWithLikes = await Promise.all(
      comments.map(async (comment) => {
        const likesCount = await this.likeCommentRepository.count({
          where: { comment: { id: comment.id } }, // Comptage des likes associés à ce commentaire
        });

        return {
          ...comment,
          likesCount,
          podcast,
          episode,
          user: {
            photo: comment.user.photo,
            username: comment.user.username,
            role: comment.user.role,
            id: comment.user.id,
          },
        };
      }),
    );

    return this.organizeMessages(commentsWithLikes);
  }

  async findOne(id: number) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    return comment;
  }
  async findAll(): Promise<Comment[]> {
    return this.commentRepository.find({
      relations: ['user'],
    });
  }

  async findOneByUser(commentId: number, userId: number) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user'],
    });

    if (!comment) {
      throw new NotFoundException(
        `Commentaire avec l'ID ${commentId} non trouvé`,
      );
    }

    if (comment.user.id !== userId) {
      throw new ForbiddenException(
        'Accès refusé : Vous ne possédez pas ce commentaire',
      );
    }

    return comment;
  }


  async softDelete(id: number, user: User) {
    const commentToRemove = await this.findOne(id);

    // Check if comment exists
    if (!commentToRemove) {
      throw new NotFoundException(`Commentaire avec l'ID ${id} non trouvé`);
    }

    // Check if the logged-in user is the owner of the comment
    if (commentToRemove.user.id !== user.id) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à supprimer ce commentaire",
      );
    }

    // Proceed with the soft delete if the user is the owner
    return await this.commentRepository.softDelete(id);
  }

  async restore(id: number, user: User) {
    const [comment] = await this.commentRepository.query(
      'SELECT * FROM comment WHERE id = ? LIMIT 1',
      [id],
    );

    if (comment.userId === user.id) {
      return await this.commentRepository.restore(id);
    } else {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à restaurer ce commentaire",
      );
    }
  }

  async findAllForSeeder(): Promise<Comment[]> {
    return await this.commentRepository.find();
  }

  async createForSeeder(comment: Comment): Promise<Comment> {
    return await this.commentRepository.save(comment);
  }
}
