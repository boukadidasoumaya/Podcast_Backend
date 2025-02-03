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


  ) {}

  async create(createTopicDto: CreatetopicDto): Promise<Topic> {
    const topic= await this.topicRepository.create(createTopicDto)
   
    return await this.topicRepository.save(topic);
  }
  
  async update(id: number, updateTopicDto: UpdatetopicDto): Promise<Topic> {
    const topic = await this.findOne(id);
    
    
  
   
  
    return this.topicRepository.save(updateTopicDto);
  }
  
  async remove(id: number): Promise<void> {
    const topic = await this.findOne(id);
    await this.topicRepository.remove(topic);
  }
 // ✅ Method to get all topics
 async findAll(): Promise<Topic[]> {
  return await this.topicRepository.find();
}

// ✅ Method to find a single topic by ID
async findOne(id: number): Promise<Topic> {
  const topic = await this.topicRepository.findOneBy({ id });
  if (!topic) {
    throw new NotFoundException(`Topic with ID ${id} not found`);
  }
  return topic;
}


  // Count podcasts for each topic
  async getTopicsWithPodcastCount() {
    try {
      console.log('Fetching topics with podcast count...');
      return await this.topicRepository
        .createQueryBuilder('topic')
        .leftJoin('podcast', 'podcast', 'podcast.topicId = topic.id')  // Join podcast table (not topic)
        .select('topic.id', 'id')
        .addSelect('topic.title', 'title')
        .addSelect('topic.image', 'image')
        .addSelect('COUNT(podcast.id)', 'podcastCount')  // Count podcasts for each topic
        .groupBy('topic.id')  // Group by Topic id to get the count per topic
        .getRawMany();  // Returns the raw result
    } catch (error) {
      console.error('Error occurred:', error);
      throw error;  // Handle error or re-throw
    }
  }
  
}