import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CurrentUser } from '../shared/Decorators/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from './entities/user.entity';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({
    type: [User],
    description: 'Utilisateurs trouvés avec succès',
  })
  async findAllUsers(@CurrentUser() user) {
    console.log(user);
    return await this.userService.findAllUsers(user);
  }

  
  @Get('withpods')
  getuserswithpods(){
    return this.userService.getuserswithpods();
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.userService.findOne(id);
  }

  // @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth('JWT-auth')
  // @ApiOkResponse({
  //   type: User,
  //   description: 'Utilisateur mis à jour avec succès',
  // })
  // @ApiResponse({
  //   status: 401,
  //   description: 'Non autorisé',
  // })
  // async update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateUserDto: UpdateUserDto,
  //   @CurrentUser() user: User,
  // ) {
  //   return await this.userService.update(id, updateUserDto, user);
  // }

  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({
    type: User,
    description: 'Mot de passe changé avec succès',
  })
  @ApiResponse({
    status: 401,
    description: 'Utilisateur non autorisé',
  })
  @ApiBadRequestResponse({
    description: 'Requête incorrecte, veuillez vérifier votre demande',
  })
  async changePassword(
    @CurrentUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.userService.changePassword(user, changePasswordDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({
    type: User,
    description: 'Utilisateur supprimé avec succès',
  })
  @ApiResponse({
    status: 401,
    description: 'Utilisateur non autorisé, seul le SuperAdmin peut accéder',
  })
  @ApiBadRequestResponse({
    description: 'Requête incorrecte, veuillez vérifier votre demande',
  })
  async removeSoft(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return await this.userService.softRemove(id, user);
  }
  @Get('restore/id/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({
    type: User,
    description: 'User restoré avec succés',
  })
  @ApiResponse({
    status: 401,
    description: 'Utilisateur non autorisé, seul le SuperAdmin peut accéder',
  })
  async restoreUser(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.userService.restoreUserById(id, user);
  }
  @Get('restore/email/:email')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({
    type: User,
    description: 'Utilisateur restoré avec succés',
  })
  @ApiResponse({
    status: 401,
    description: 'Utilisateur non autorisé, seul le SuperAdmin peut accéder',
  })
  async restoreUserByEmail(
    @CurrentUser() user: User,
    @Param('email') email: string,
  ) {
    return await this.userService.restoreUserByEmail(email, user);
  }
}
