import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import  { EpisodeGateway } from './gateway/episode.gateway';
@Controller('episodes')

export class EpisodeController {
  constructor(
    private readonly episodeService: EpisodeService,
    private readonly episodeGateway: EpisodeGateway,
  ) {}

  @Post()
  async create(@Body() createEpisodeDto: CreateEpisodeDto) {
      const episode = await this.episodeService.create(createEpisodeDto);
      this.episodeGateway.notifyEpisodeUpdate(episode);  // Notify clients with full episode data
      return episode;
    }

  @Get()
  findAll() {
    return this.episodeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.episodeService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateEpisodeDto: UpdateEpisodeDto) {
    const updatedEpisode = await this.episodeService.update(id, updateEpisodeDto);
    this.episodeGateway.notifyEpisodeUpdate(updatedEpisode);  // Notify clients with full updated episode data
    return updatedEpisode;
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.episodeService.remove(id);
  }

  @Post(':id/views')
  async incrementViews(@Param('id') id: number): Promise<{ message: string; views: number }> {
    const episode = await this.episodeService.incrementViews(+id);
    this.episodeGateway.notifyViewUpdate(episode.id, episode.views); // Notify clients about view count update
    this.episodeGateway.notifyEpisodeUpdate(episode);  // Notify clients with full updated episode data
    return { message: 'View count updated', views: episode.views };
  }
}