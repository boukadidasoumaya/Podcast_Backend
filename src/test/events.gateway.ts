import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway(80, { namespace: 'events' })
export class EventsGateway {
  @SubscribeMessage('new message')
  onNewMessage(@MessageBody() message: any) {
    console.log(message);
  }
}
