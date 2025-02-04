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
  UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { EpisodeGateway } from './gateway/episode.gateway';
import { Episode } from './entities/episode.entity';
import { ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { createFileTypeInterceptor } from '../shared/interceptors/uplaod-file.interceptor';
@Controller('episodes')
export class EpisodeController {
  constructor(
    private readonly episodeService: EpisodeService,
    private readonly episodeGateway: EpisodeGateway,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createEpisodeDto: CreateEpisodeDto) {
    console.log(createEpisodeDto);
    const episode = await this.episodeService.create(createEpisodeDto);

    return episode;
  }
  @Post('coverImage')
  @UseInterceptors(
    FileInterceptor('coverImage'),
    createFileTypeInterceptor('image'),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return { message: 'Image uploadée avec succès', filename: file.originalname };
  }
  @Post('filepath')
  @UseInterceptors(
    FileInterceptor('filepath'),
    createFileTypeInterceptor('video'),
  )
  uploadVideo(@UploadedFile() file: Express.Multer.File) {
    return { message: 'Video uploadée avec succès', filename: file.originalname };
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

  @Post(':id/views')
  async incrementViews(
    @Param('id') id: number,
  ): Promise<{ message: string; views: number }> {
    console.log('i am in');
    const episode = await this.episodeService.incrementViews(+id);
    this.episodeGateway.notifyViewUpdate(episode.id, episode.views); // Notify clients about view count update
    this.episodeGateway.notifyEpisodeUpdate(episode); // Notify clients with full updated episode data
    return { message: 'View count updated', views: episode.views };
  }
}
