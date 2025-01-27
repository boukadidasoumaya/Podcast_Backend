import { Module } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { SubscribeController } from './subscribe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscribeAll } from './entities/subscribe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubscribeAll])],
  controllers: [SubscribeController],
  providers: [SubscribeService],
  exports: [SubscribeService],
})
export class SubscribeModule {}
