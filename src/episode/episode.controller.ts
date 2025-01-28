import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { EpisodeGateway } from './gateway/episode.gateway';
import { Episode } from './entities/episode.entity';
import { EpisodeGateway } from './gateway/episode.gateway';
import { Episode } from './entities/episode.entity';
@Controller('episodes')
export class EpisodeController {
  constructor(
    private readonly episodeService: EpisodeService,
    private readonly episodeGateway: EpisodeGateway,
  ) {}

  @Post()
  async create(@Body() createEpisodeDto: CreateEpisodeDto) {
    const episode = await this.episodeService.create(createEpisodeDto);
    return episode;
  }
    const episode = await this.episodeService.create(createEpisodeDto);
    return episode;
  }


  @Get()
  findAll(): Promise<Episode[]> {
  findAll(): Promise<Episode[]> {
    return this.episodeService.findAll();
  }
  @Get('trending')
  async getTrendingEpisodes(): Promise<Episode[]> {
    return this.episodeService.findAllTrending();
  }

  @Get('latest')
  async getLatestEpisodes(): Promise<Episode[]> {
    return this.episodeService.findAllLatest();
  }
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Episode> {
  findOne(@Param('id') id: number): Promise<Episode> {
    return this.episodeService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateEpisodeDto: UpdateEpisodeDto,
  ) {
    const updatedEpisode = await this.episodeService.update(
      id,
      updateEpisodeDto,
    );
  async update(
    @Param('id') id: number,
    @Body() updateEpisodeDto: UpdateEpisodeDto,
  ) {
    const updatedEpisode = await this.episodeService.update(
      id,
      updateEpisodeDto,
    );
    return updatedEpisode;
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.episodeService.remove(id);
  }

  @Post(':id/views')
  async incrementViews(
    @Param('id') id: number,
  ): Promise<{ message: string; views: number }> {
    console.log('i am in');
  async incrementViews(
    @Param('id') id: number,
  ): Promise<{ message: string; views: number }> {
    console.log('i am in');
    const episode = await this.episodeService.incrementViews(+id);
    this.episodeGateway.notifyViewUpdate(episode.id, episode.views); // Notify clients about view count update
    this.episodeGateway.notifyEpisodeUpdate(episode); // Notify clients with full updated episode data
    this.episodeGateway.notifyViewUpdate(episode.id, episode.views); // Notify clients about view count update
    this.episodeGateway.notifyEpisodeUpdate(episode); // Notify clients with full updated episode data
    return { message: 'View count updated', views: episode.views };
  }
}

