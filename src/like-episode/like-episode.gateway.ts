import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LikeEpisodeService } from './like-episode.service';
import { CreateLikeEpisodeDto } from './dto/create-like-episode.dto';
import { DeleteLikeEpisodeDto } from './dto/delete-like-episode.dto';
import { Episode } from '../episode/entities/episode.entity';

@WebSocketGateway(8001, { cors: '*' })
export class LikeEpisodeGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly likeEpisodeService: LikeEpisodeService) {}

  @SubscribeMessage('likeEpisode')
  async handleLike(
    @MessageBody() createEpisodeLikeDto: CreateLikeEpisodeDto,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const like =
        await this.likeEpisodeService.likeEpisode(createEpisodeLikeDto);
      const count = await this.likeEpisodeService.getLikesEpisodeAdded(
        like.episode,
      );
      this.server.emit('likeEpisode', count);
      return like;
    } catch (error) {
      console.error('Error liking the episode:', error);
      socket.emit('errorMessage', 'An error occurred while liking the episode');
    }
  }

  @SubscribeMessage('unlikeEpisode')
  async handleUnlike(
    @MessageBody() deleteLikeEpisodeDto: DeleteLikeEpisodeDto,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const unlike =
        await this.likeEpisodeService.unlikeEpisode(deleteLikeEpisodeDto);
      console.log('unlike episode:', unlike);
      const count = await this.likeEpisodeService.getLikesEpisodeAdded(
        unlike.episode,
      );

      this.server.emit('unlikeEpisode', count);
    } catch (error) {
      console.error('Error unliking the episode:', error);
      socket.emit(
        'errorMessage',
        'An error occurred while unliking the episode',
      );
    }
  }

  @SubscribeMessage('getLikes')
  async handleGetLikes(@ConnectedSocket() socket: Socket) {
    try {
      const response = await this.likeEpisodeService.getEpisodeLikesCount();
      this.server.emit('getLikes', { response });
    } catch (error) {
      console.error('Error fetching likes:', error);
      socket.emit('errorMessage', 'An error occurred while fetching likes');
    }
  }
}