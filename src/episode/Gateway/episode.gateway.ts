import { Server, Socket } from 'socket.io';
import { WebSocketGateway, OnGatewayInit, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Episode } from '../entities/episode.entity';
import { ConnectedSocket } from '@nestjs/websockets';
import { EpisodeService } from '../episode.service';
@WebSocketGateway(
    8001, { cors: '*' },
)

export class EpisodeGateway implements OnGatewayInit {
    @WebSocketServer()
    server: Server;
    constructor(private readonly episodeService: EpisodeService) {}    @SubscribeMessage('episodeUpdate')
    afterInit(server: Server) {
      console.log('WebSocket server initialized');
      server.emit('WebSocket server initialized')
    }
  
@SubscribeMessage('episodeUpdate')
  notifyEpisodeUpdate(episode: Episode) {
    this.server.emit('episodeUpdate', episode);  // Send the full episode data to clients
  }
  @SubscribeMessage('viewUpdate')
  async notifyViewUpdate(
    @ConnectedSocket() client: Socket, 
    @MessageBody() data: { id: number; views: number }
  ) {
    console.log('View count updated:', data);

    // Increment views for the episode
    const updatedEpisode = await this.episodeService.incrementViews(data.id);

    // Emit updated view count to all connected clients
    this.server.emit('viewUpdate', { id: data.id, views: updatedEpisode.views });
  }
}