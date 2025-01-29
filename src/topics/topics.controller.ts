import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';
import { Topic } from './entities/topic.entity';
import { TopicService } from './topic.service';
import { CreatetopicDto } from './dto/create-topic.dto';
import { UpdatetopicDto } from './dto/update-topic.dto';
@Controller('topics')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  // Get all topics
  @Get()
  @ApiOperation({ summary: 'Get all topics' })
  @ApiResponse({ status: 200, description: 'Successfully fetched all topics', type: [Topic] })
  async findAll(): Promise<Topic[]> {
    return this.topicService.findAll();
  }

  // Get a topic by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get a topic by ID' })
  @ApiResponse({ status: 200, description: 'Successfully fetched the topic', type: Topic })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  async findOne(@Param('id') id: number): Promise<Topic> {
    return this.topicService.findOne(id);
  }

  // Create a new topic
  @Post()
  @ApiOperation({ summary: 'Create a new topic' })
  @ApiResponse({ status: 201, description: 'Successfully created the topic', type: Topic })
  create(@Body() createTopicDto: CreatetopicDto) {
    return this.topicService.create(createTopicDto);
  }
  // Update a topic by ID
  @Put(':id')
  @ApiOperation({ summary: 'Update a topic by ID' })
  @ApiResponse({ status: 200, description: 'Successfully updated the topic', type: Topic })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  update(@Param('id') id: number, @Body() updateTopicDto: UpdatetopicDto) {
    return this.topicService.update(id, updateTopicDto);
  }
  // Delete a topic by ID
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a topic by ID' })
  @ApiResponse({ status: 200, description: 'Successfully deleted the topic' })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.topicService.remove(id);
  }
}