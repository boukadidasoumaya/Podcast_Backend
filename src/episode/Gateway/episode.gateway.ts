import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { Episode } from '../entities/episode.entity';
@WebSocketGateway()
export class EpisodeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  // Notify clients about episode data updates
  notifyEpisodeUpdate(episode: Episode) {
    this.server.emit('episodeUpdate', episode);  // Send the full episode data to clients
  }

  // Notify clients about the view count update
  notifyViewUpdate(episodeId: number, views: number) {
    this.server.emit('viewUpdate', { episodeId, views });
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }
}
