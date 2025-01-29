import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CreatetopicDto } from './dto/create-topic.dto';
import { ApiOperation } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';
import { Topic } from './entities/topic.entity';
import { TopicService } from './topic.service';
@Controller('topics')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  // Get all topics
  @Get()
  async findAll(): Promise<Topic[]> {
    return this.topicService.findAll();
  }

  // Get a topic by ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Topic> {
    return this.topicService.findOne(id);
  }

  // Create a new topic
  @Post()
  async create(
    @Body('title') title: string,
    @Body('episodes') episodes: number,
    @Body('image') image: string,
  ): Promise<Topic> {
    return this.topicService.create(title, episodes, image);
  }

  // Update a topic by ID
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body('title') title: string,
    @Body('episodes') episodes: number,
    @Body('image') image: string,
  ): Promise<Topic> {
    return this.topicService.update(id, title, episodes, image);
  }

  // Delete a topic by ID
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.topicService.remove(id);
  }
}