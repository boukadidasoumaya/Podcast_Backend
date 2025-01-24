
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { Podcast } from '../podcast/entities/podcast.entity';
import { Episode } from '../episode/entities/episode.entity';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DeleteCommentDto } from './dto/delete-comment.dto';
import { FindCommentDto } from './dto/find-comment.dto';
import { Comment } from './entities/comment.entity';

@WebSocketGateway(8001, { cors: '*' })
export class CommentGateway {
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly commentService: CommentService,
    private readonly userService: UserService,
  ) {}

  @SubscribeMessage('comment')
  async createComment(
    @MessageBody() createCommentDto: CreateCommentDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<CreateCommentDto> {
    try {
      const sender = this.commentService.clientToUser[socket.id];
      const comment = await this.commentService.create(createCommentDto);
      this.server.emit('comment', comment);
      return createCommentDto;
    } catch (error) {
      console.error('Error creating comment:', error);
      socket.emit(
        'errorMessage',
        'An error occurred while creating the comment',
      );
    }
  }

  @SubscribeMessage('comments')
  async findAllByEpisode(
    @MessageBody() findCommentDto: FindCommentDto,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const comments =
        await this.commentService.findAllByEpisode(findCommentDto);
      this.server.emit('comments', comments);
    } catch (error) {
      console.error('Error finding comments:', error);
      socket.emit(
        'errorMessage',
        'An error occurred while finding the comments',
      );
    }
  }


  @SubscribeMessage('deleteComment')
  async remove(@MessageBody() comment: DeleteCommentDto): Promise<void> {
    const { id, user } = comment;
    await this.commentService.softDelete(id, user);
    this.server.emit('deletedComment', id);
  }
}
