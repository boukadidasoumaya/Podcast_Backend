import { Server, Socket } from 'socket.io';
import { WebSocketGateway, OnGatewayInit, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Episode } from '../entities/episode.entity';
@WebSocketGateway( { cors: '*' }
  
)

export class EpisodeGateway implements OnGatewayInit {
    @WebSocketServer()
    server: Server;
  
    afterInit(server: Server) {
      console.log('WebSocket server initialized');
    }
  
    @SubscribeMessage('episodeUpdate')
    handleEpisodeUpdate(@MessageBody() data: any) {
      this.server.emit('episodeUpdate', data); // Emit the event to all connected clients
    }
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
