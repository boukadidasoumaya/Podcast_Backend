import { Server, Socket } from 'socket.io';
import { WebSocketGateway, OnGatewayInit, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Episode } from '../entities/episode.entity';
import { ConnectedSocket } from '@nestjs/websockets';
@WebSocketGateway(
    8001, { cors: '*' },
)

export class EpisodeGateway implements OnGatewayInit {
    @WebSocketServer()
    server: Server;
    @SubscribeMessage('episodeUpdate')

    afterInit(server: Server) {
      console.log('WebSocket server initialized');
      server.emit('WebSocket server initialized')
    }
  
@SubscribeMessage('episodeUpdate')
  notifyEpisodeUpdate(episode: Episode) {
    this.server.emit('episodeUpdate', episode);  // Send the full episode data to clients
  }
@SubscribeMessage('viewUpdate')
    notifyViewUpdate(id: number, views: number) {
    console.log('View count updated:', views);
      // Emit updated view count to all connected clients
    this.server.emit('viewUpdate', { id, views });
  }
  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }
}
