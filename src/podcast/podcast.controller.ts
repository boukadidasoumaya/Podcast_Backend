/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';

@Controller('podcast')
export class PodcastController {
  constructor(private readonly podcastService: PodcastService) { }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post()
  create(@Body() createPodcastDto: CreatePodcastDto) {
    return this.podcastService.create(createPodcastDto);
  }

  @Get()
  filterpodcasts(@Query() filtres) {
    return this.podcastService.filterpodcasts(filtres)

  }

  @Get()
  findAll() {
    return this.podcastService.findAll();
  }

  @Get('withusers')
  getpodswithusers() {
    return this.podcastService.getpodswithusers();
  }

  @Get('withepisodes')
  getpodswithepisodes() {
    return this.podcastService.getpodswithepisodes();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.podcastService.findOne(+id);
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePodcastDto: UpdatePodcastDto) {
    return this.podcastService.update(+id, updatePodcastDto);
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.podcastService.remove(+id);
  }


  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post(':p_id/subscribe')
  subscribe(@Param('p_id') p_id: string, @Req() req) {
    const u_id = req.user.id;
    return this.podcastService.subscribe(+u_id, +p_id);
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post(':p_id/unsubscribe')
  unsubscribe(@Param('p_id') p_id: string, @Req() req) {
    const u_id = req.user.id;
    return this.podcastService.unsubscribe(+u_id, +p_id);
  }

  @Get(':id/podcasts')
  getpodsbyuser(@Param('id') id: string) {
    return this.podcastService.getpodsparuser(+id);
  }
}
