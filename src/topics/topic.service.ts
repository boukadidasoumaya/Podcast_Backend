import { Injectable } from '@nestjs/common';
import { CreatetopicDto } from './dto/create-topic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from './entities/topic.entity';
@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private topicRepository: Repository<Topic>,
  ) {}

  // Get all topics
  async findAll(): Promise<Topic[]> {
    return this.topicRepository.find();
  }

  async findOne(id: number): Promise<Topic> {
    return this.topicRepository.findOne({ where: { id } });
  }  

  // Create a new topic
  async create(title: string, episodes: number, image: string): Promise<Topic> {
    const topic = this.topicRepository.create({ title, episodes, image });
    return this.topicRepository.save(topic);
  }

  // Update a topic by its ID
  async update(id: number, title: string, episodes: number, image: string): Promise<Topic> {
    const topic = await this.findOne(id);
    if (!topic) {
      throw new Error('Topic not found');
    }
    topic.title = title;
    topic.episodes = episodes;
    topic.image = image;
    return this.topicRepository.save(topic);
  }

  // Delete a topic by its ID
  async remove(id: number): Promise<void> {
    const topic = await this.findOne(id);
    if (!topic) {
      throw new Error('Topic not found');
    }
    await this.topicRepository.remove(topic);
  }
}