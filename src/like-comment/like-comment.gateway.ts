import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LikeCommentService } from './like-comment.service';
import { CreateLikeCommentDto } from './dto/create-like-comment.dto';
import { DeleteLikeCommentDto } from './dto/delete-like-comment.dto';

@WebSocketGateway(8001, { cors: '*' })
export class LikeCommentGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly likeCommentService: LikeCommentService) {}

  // Gestion de l'ajout d'un like
  @SubscribeMessage('likeComment')
  async handleLike(
    @MessageBody() createLikeCommentDto: CreateLikeCommentDto,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const like =
        await this.likeCommentService.likeComment(createLikeCommentDto);
      const totalLikes = await this.likeCommentService.getCommentLikesCount();
      this.server.emit('likeComment', { totalLikes });
      return like;
    } catch (error) {
      console.error('Error liking the comment:', error);
      socket.emit('errorMessage', 'An error occurred while liking the comment');
    }
  }

  // Gestion de la suppression d'un like
  @SubscribeMessage('unlikeComment')
  async handleUnlike(
    @MessageBody() deleteLikeCommentDto: DeleteLikeCommentDto,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      await this.likeCommentService.unlikeComment(deleteLikeCommentDto);
      const totalLikes = await this.likeCommentService.getCommentLikesCount();
      this.server.emit('unlikeComment', { totalLikes });
    } catch (error) {
      console.error('Error unliking the comment:', error);
      socket.emit(
        'errorMessage',
        'An error occurred while unliking the comment',
      );
    }
  }

  @SubscribeMessage('getLikes')
  async handleGetLikes(@ConnectedSocket() socket: Socket) {
    try {
      const response = await this.likeCommentService.getCommentLikesCount();
      this.server.emit('getLikes', { response });
    } catch (error) {
      console.error('Error fetching likes:', error);
      socket.emit('errorMessage', 'An error occurred while fetching likes');
    }
  }
}
