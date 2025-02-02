import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
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

  @Get()
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
    return updatedEpisode;
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.episodeService.remove(id);
  }

}
