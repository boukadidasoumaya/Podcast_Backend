// test/episode.gateway.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { EpisodeModule } from '../src/episode/episode.module';  // Adjust path as necessary
import { io, Socket } from 'socket.io-client';
import { EpisodeService } from '../src/episode/episode.service';
import { EpisodeGateway } from '../src/episode/gateway/episode.gateway';

describe('EpisodeGateway (Real-Time)', () => {
  let app: INestApplication;
  let gateway: EpisodeGateway;
  let client: Socket;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [EpisodeModule], // Make sure to import all necessary modules
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get the gateway instance
    gateway = app.get<EpisodeGateway>(EpisodeGateway);
  });

  afterAll(async () => {
    // Close the app after tests
    await app.close();
  });

  beforeEach(() => {
    // Initialize WebSocket client before each test
    client = io(app.getHttpServer(), {
      transports: ['websocket'],
    });
  });

  afterEach(() => {
    // Disconnect the WebSocket client after each test
    if (client.connected) {
      client.disconnect();
    }
  });

  it('should connect to WebSocket server', (done) => {
    client.on('connect', () => {
      console.log('Client connected to WebSocket');
      done();
    });
  });

  it('should receive episode update when view count is incremented', (done) => {
    client.on('episodeUpdate', (episode) => {
      console.log('Received episode update:', episode);
      expect(episode).toHaveProperty('views');
      expect(episode.views).toBeGreaterThan(0);
      done();
    });

    // Emit the 'incrementViews' event
    client.emit('incrementViews', { episodeId: 1 });
  });
});
