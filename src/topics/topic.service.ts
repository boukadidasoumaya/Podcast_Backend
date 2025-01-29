import { Injectable } from '@nestjs/common';
import { CreatetopicDto } from './dto/create-topic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from './entities/topic.entity';
import { Podcast } from 'src/podcast/entities/podcast.entity';
import { NotFoundException } from '@nestjs/common';
import { UpdatetopicDto } from './dto/update-topic.dto';
@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,

    @InjectRepository(Podcast)
    private readonly podcastRepository: Repository<Podcast>,
  ) {}

  async create(createTopicDto: CreatetopicDto): Promise<Topic> {
    console.log('Creating topic...');
  
    // Extract DTO properties
    const { title, image, podcastId } = createTopicDto;
  
    // Fetch the podcast by its ID
    const podcast = await this.podcastRepository.findOne({
      where: { id: podcastId },
    });
  
    if (!podcast) {
      throw new NotFoundException('Podcast not found');
    }
  
    // Create a new topic and associate it with the podcast
    const topic = this.topicRepository.create({
      title,
      image,
      podcasts: [podcast],  // Ensure your entity supports this relation
    });
  
    // Save to the database
    return this.topicRepository.save(topic);
  }
  
  async update(id: number, updateTopicDto: UpdatetopicDto): Promise<Topic> {
    const topic = await this.findOne(id);
    
    if (!topic) {
      throw new NotFoundException('Topic not found');
    }
  
    const { title, image, podcastId } = updateTopicDto;
    const podcast = await this.podcastRepository.findOne({ where: { id: podcastId } });
  
    if (!podcast) {
      throw new NotFoundException('Podcast not found');
    }
  
    // Update topic details
    topic.title = title;
    topic.image = image;
    topic.podcasts = [podcast];
  
    return this.topicRepository.save(topic);
  }
  
  async remove(id: number): Promise<void> {
    const topic = await this.findOne(id);
    await this.topicRepository.remove(topic);
  }
// ✅ Add missing `findAll` method
async findAll(): Promise<Topic[]> {
  return this.topicRepository.find({ relations: ['podcasts'] });
}

// ✅ Add missing `findOne` method
async findOne(id: number): Promise<Topic> {
  const topic = await this.topicRepository.findOne({ where: { id }, relations: ['podcasts'] });
  if (!topic) {
    throw new NotFoundException('Topic not found');
  }
  return topic;
}
}