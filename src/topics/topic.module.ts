import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { Topic } from './entities/topic.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Podcast } from 'src/podcast/entities/podcast.entity';

@Module({
      imports: [TypeOrmModule.forFeature([Topic])], // Add this line to import the repository for Episode
  controllers: [TopicController],
  providers: [TopicService],
  exports:[TopicService]
})
export class topicModule {}
