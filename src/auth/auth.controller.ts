import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginCredentialsDto } from './dto/logincredentials.dto';
import { SendPasswordResetDto } from './dto/send-password-reset.dto';
import { VerifyResetCodeDto } from './dto/verify-reset-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Admin } from '../user/entities/admin.entity';
import { CurrentUser } from '../shared/Decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { CreateSuperAdminDto } from '../user/dto/create-superadmin.dto';
import { SuperAdmin } from '../user/entities/superAdmin.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('create-admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({
    type: Admin,
    description: 'Administrateur créé avec succès',
  })
  @ApiResponse({
    status: 401,
    description: 'Utilisateur non autorisé',
  })
  @ApiBadRequestResponse({
    description: 'Requête incorrecte, veuillez vérifier votre demande',
  })
  async createAdmin(
    @CurrentUser() user: User,
    @Body() createUserDto: CreateUserDto,
  ): Promise<Partial<Admin>> {
    return this.authService.createAdmin(createUserDto, user);
  }
  @Post('create/superadmin')
  @ApiOkResponse({
    type: SuperAdmin,
    description: 'SuperAdmin créé avec succès',
  })
  @ApiBadRequestResponse({
    description: 'Requête incorrecte, veuillez vérifier votre demande',
  })
  async createSuperAdmin(
    @Body() createSuperAdminDto: CreateSuperAdminDto,
  ): Promise<Partial<SuperAdmin>> {
    return await this.authService.createSuperAdmin(createSuperAdminDto);
  }
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiOkResponse({ description: 'Admin connecté avec succès' })
  @ApiBadRequestResponse({
    description: 'Requête incorrecte, veuillez vérifier votre demande',
  })
  async login(@Body() loginCredentialsDto: LoginCredentialsDto) {
    return await this.authService.login(loginCredentialsDto);
  }

  @Post('forgot-password')
  @ApiOkResponse({
    description: 'Code de réinitialisation du mot de passe envoyé',
  })
  @ApiBadRequestResponse({
    description: 'Requête incorrecte, veuillez vérifier votre demande',
  })
  async forgotPassword(@Body() sendPasswordResetDto: SendPasswordResetDto) {
    const { email } = sendPasswordResetDto;

    try {
      await this.authService.sendPasswordResetCode(email);
      return { message: 'Code de réinitialisation du mot de passe envoyé' };
    } catch (error) {
      throw new BadRequestException(
        'Impossible d envoyer le code de réinitialisation du mot de passe. ' +
          error.message,
      );
    }
  }

  @Post('verify-reset-code')
  @ApiOkResponse({
    description: 'Le code de réinitialisation est valide',
  })
  @ApiBadRequestResponse({
    description: 'Requête incorrecte, veuillez vérifier votre demande',
  })
  async verifyResetCode(@Body() verifyResetCodeDto: VerifyResetCodeDto) {
    const { email, code } = verifyResetCodeDto;

    try {
      const isCodeValid = await this.authService.verifyResetCode(email, code);
      if (isCodeValid) {
        return { message: 'Le code de réinitialisation est valide' };
      } else {
        throw new BadRequestException(
          'Code de réinitialisation invalide ou expiré',
        );
      }
    } catch (error) {
      throw new BadRequestException(
        'Erreur lors de la vérification du code de réinitialisation. ' +
          error.message,
      );
    }
  }

  @Post('reset-password')
  @ApiOkResponse({
    description: 'Le mot de passe a été réinitialisé avec succès',
  })
  @ApiBadRequestResponse({
    description: 'Requête incorrecte, veuillez vérifier votre demande',
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const { email, newPassword, code } = resetPasswordDto;

    try {
      await this.authService.resetPassword(email, newPassword, code);
      return { message: 'Le mot de passe a été réinitialisé avec succès' };
    } catch (error) {
      throw new BadRequestException(
        'Erreur lors de la réinitialisation du mot de passe. ' + error.message,
      );
    }
  }
}
