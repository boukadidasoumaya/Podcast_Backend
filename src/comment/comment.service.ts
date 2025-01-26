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
import { EpisodeService } from '../episode/episode.service';
import { PodcastService } from '../podcast/podcast.service';
import { Episode } from '../episode/entities/episode.entity';
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
  ) {}
  clientToUser: any = {};

  async create(createCommentDto: CreateCommentDto) {
    console.log(typeof createCommentDto.user);
    console.log(typeof createCommentDto.podcast);
    console.log(typeof createCommentDto.episode);
    const newComment = this.commentRepository.create({
      ...createCommentDto,
    });
    console.log(createCommentDto);

    await this.commentRepository.save(newComment);

    return newComment;
  }
  async findAllByEpisodeId(episodeId: number): Promise<Comment[]> {
    try {
      // Replace this with your actual ORM or database query logic
      return await this.commentRepository.find({
        where: { episode: { id: episodeId } }, // Use the relation to filter by episode ID
        relations: ['episode'], // Ensure the 'episode' relation is loaded
      });    } catch (error) {
      console.error('Error fetching comments from database:', error);
      throw new Error('Failed to fetch comments');
    }
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

    const comments = await this.commentRepository.find({
      where: {
        podcast: { id: podcast.id },
        episode: { id: episode.id }, // Condition pour filtrer par épisode
      },
      relations: ['parent', 'user', 'podcast', 'episode'],
    });

    const commentsWithUserDetails = comments.map((comment) => {
      return {
        ...comment,
        podcast,
        episode,
        user: {
          photo: comment.user.photo,
          username: comment.user.username,
          role: comment.user.role,
          id: comment.user.id,
        },
      };
    });

    return this.organizeMessages(commentsWithUserDetails);
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

  // async update(
  //   id: number,
  //   updateCommentDto: FindCommentDto,
  //   user: User,
  // ): Promise<Comment> {
  //   const comment = await this.findOne(id);
  //   const updatedComment = await this.commentRepository.preload({
  //     id,
  //     ...updateCommentDto,
  //   });
  //
  //   if (!updatedComment) {
  //     throw new NotFoundException(`Commentaire avec l'ID ${id} non trouvé`);
  //   }
  //
  //   if (comment.user?.id === user.id) {
  //     return await this.commentRepository.save(updatedComment);
  //   } else {
  //     throw new UnauthorizedException(
  //       "Vous n'êtes pas autorisé à mettre à jour ce commentaire",
  //     );
  //   }
  // }

  async softDelete(id: number, user: User) {
    const commentToRemove = await this.findOne(id);
    if (!commentToRemove) {
      throw new NotFoundException(`Commentaire avec l'ID ${id} non trouvé`);
    }

    if (commentToRemove.user.id === user.id) {
      return await this.commentRepository.softDelete(id);
    } else {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à supprimer ce commentaire",
      );
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
