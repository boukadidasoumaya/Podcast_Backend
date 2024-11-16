import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/passport-jwt.strategy';
import { Admin } from '../user/entities/admin.entity';
import { SuperAdmin } from '../user/entities/superAdmin.entity';
import { TypedEventEmitter } from '../shared/event-emitter/typed-event-emitter.class';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Admin, SuperAdmin]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
