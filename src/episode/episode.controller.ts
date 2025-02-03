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
  UseInterceptors,
} from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { EpisodeGateway } from './gateway/episode.gateway';
import { Episode } from './entities/episode.entity';
import { ApiConsumes } from '@nestjs/swagger';
import { createFileUploadInterceptor } from '../shared/interceptors/filemp-uplaod.interceptor';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
@Controller('episodes')
export class EpisodeController {
  constructor(
    private readonly episodeService: EpisodeService,
    private readonly episodeGateway: EpisodeGateway,
  ) {}

  
  @Post()
  @UseInterceptors(
    createFileUploadInterceptor({
      fieldName: 'filepath',
      destination: 'media',
      allowedFileTypes: /\.(mp4|mp3)$/i,
      fileSizeLimit: 50 * 1024 * 1024,
    }),
  )
  @UseGuards(JwtAuthGuard)
  async create(@Body() createEpisodeDto: CreateEpisodeDto) {
    console.log(createEpisodeDto);
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: number) {
    return this.episodeService.remove(id);
  }

}
