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

  // Gestion de l'ajout d'un like
  @SubscribeMessage('likeEpisode')
  async handleLike(
    @MessageBody() createEpisodeLikeDto: CreateLikeEpisodeDto,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const like =
        await this.likeEpisodeService.likeEpisode(createEpisodeLikeDto);
      const totalLikes = await this.likeEpisodeService.getEpisodeLikesCount();
      this.server.emit('likeEpisode', {
        totalLikes,
      });
      return like;
    } catch (error) {
      console.error('Error liking the episode:', error);
      socket.emit('errorMessage', 'An error occurred while liking the episode');
    }
  }

  // Gestion de la suppression d'un like
  @SubscribeMessage('unlikeEpisode')
  async handleUnlike(
    @MessageBody() deleteLikeEpisodeDto: DeleteLikeEpisodeDto,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      await this.likeEpisodeService.unlikeEpisode(deleteLikeEpisodeDto);
      const totalLikes = await this.likeEpisodeService.getEpisodeLikesCount();
      this.server.emit('unlikeEpisode', {
        totalLikes,
      });
    } catch (error) {
      console.error('Error unliking the episode:', error);
      socket.emit(
        'errorMessage',
        'An error occurred while unliking the episode',
      );
    }
  }

  @SubscribeMessage('getLikes')
  async handleGetLikes(
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const response= await this.likeEpisodeService.getEpisodeLikesCount();
      this.server.emit('getLikes', { response });
    } catch (error) {
      console.error('Error fetching likes:', error);
      socket.emit('errorMessage', 'An error occurred while fetching likes');
    }
  }
}
