import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UploadedFile,
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
import { ChangeEmailDto } from './dto/change-email.dto';
import { User } from './entities/user.entity';
import { ContactUsDto } from './dto/contact-us.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createFileTypeInterceptor } from '../shared/interceptors/uplaod-file.interceptor';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('contact')
  async contactSupport(@Body() contactDto: ContactUsDto) {
    return this.userService.contactSupport(contactDto);
  }
  @Post('photo')
  @UseInterceptors(FileInterceptor('photo'), createFileTypeInterceptor('image'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return {
      message: 'Image uploadée avec succès',
      filename: file.originalname,
    };
  }
  @Get('owner-details')
  async getOwnerDetails() {
    return await this.userService.getOwnerDetails();
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({
    type: [User],
    description: 'Utilisateurs trouvés avec succès',
  })
  async findAllUsers(@CurrentUser() user: User) {
    console.log(user);
    return await this.userService.findAllUsers(user);
  }

  @Get('withpods')
  getuserswithpods() {
    return this.userService.getuserswithpods();
  }
  @Get('current-user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({
    type: [User],
    description: 'Utilisateur trouvé avec succès',
  })
  async currentUser(@CurrentUser() user) {
    console.log(user);
    return await user;
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({
    type: User,
    description: 'Profile retrieved successfully',
  })
  async getUserProfile(@CurrentUser() user: User) {
    return user;
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({
    type: User,
    description: 'Profile updated successfully',
  })
  async updateProfile(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.userService.update(user.id, updateUserDto);
    console.log('Updated User:', updatedUser);
    return updatedUser;
  }

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

  @Put('update-email')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({
    type: User,
    description: 'Email changé avec succès',
  })
  @ApiResponse({
    status: 401,
    description: 'Utilisateur non autorisé',
  })
  @ApiBadRequestResponse({
    description: 'Requête incorrecte, veuillez vérifier votre demande',
  })
  async changeEmail(
    @CurrentUser() user: User,
    @Body() changeEmailDto: ChangeEmailDto,
  ) {
    return await this.userService.changeEmail(user, changeEmailDto);
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
