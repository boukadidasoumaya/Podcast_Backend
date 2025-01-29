import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicController } from './topics.controller';
import { Topic } from './entities/topic.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
      imports: [TypeOrmModule.forFeature([Topic])], // Add this line to import the repository for Episode
  controllers: [TopicController],
  providers: [TopicService],
})
export class topicModule {}
