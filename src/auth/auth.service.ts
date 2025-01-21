import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';

import { LoginCredentialsDto } from './dto/logincredentials.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from '../user/entities/admin.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { SuperAdmin } from '../user/entities/superAdmin.entity';
import { UserRoleEnum } from '../shared/Enums/user-role.enum';
import { CreateSuperAdminDto } from '../user/dto/create-superadmin.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SuperAdmin)
    private superAdminRepository: Repository<SuperAdmin>,
    private readonly mailService: EmailService,
  ) {}

  async createAdmin(
    adminData: CreateUserDto,
    currentUser: User,
  ): Promise<Partial<Admin>> {
    if (currentUser.role !== UserRoleEnum.SUPER_ADMIN) {
      throw new UnauthorizedException('Accès non autorisé');
    }
    const user = this.adminRepository.create({
      ...adminData,
    });
    // Un mot de passe crypté par défaut (utilisant son nom) est créé pour l'Admin et sera envoyé par e-email
    const password = crypto.randomBytes(4).toString('hex');
    user.password = password;
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, user.salt);
    try {
      await this.adminRepository.save(user);
    } catch (e) {
      throw new ConflictException('Cet email existe déjà');
    }
    await this.mailService.sendRegistrationEmail({
      name: adminData.firstName + ' ' + adminData.lastName,
      email: adminData.email,
      password: password,
    });
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  async createSuperAdmin(
    adminData: CreateSuperAdminDto,
  ): Promise<Partial<Admin>> {
    if (adminData.license === process.env.LICENSE) {
      const admin = this.superAdminRepository.create({
        ...adminData,
      });
      admin.role = this.superAdminRepository.metadata.targetName;
      admin.salt = await bcrypt.genSalt();
      admin.password = await bcrypt.hash(admin.password, admin.salt);
      try {
        await this.superAdminRepository.save(admin);
      } catch (e) {
        throw new ConflictException('Cet email existe déjà');
      }
      await this.mailService.sendRegistrationEmail({
        name: adminData.firstName + ' ' + adminData.lastName,
        email: adminData.email,
        password: adminData.password,
      });
      return {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
      };
    } else {
      throw new UnauthorizedException('Accès non autorisé');
    }
  }
  async register(userData: CreateUserDto): Promise<Partial<User>> {
    if (!userData.password) {
      throw new Error('Password is required');
    }

    const user = this.userRepository.create({
      ...userData,
    });

    user.role = this.userRepository.metadata.targetName;
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(userData.password, user.salt);

    try {
      await this.userRepository.save(user);
    } catch (e) {
      throw new ConflictException('Cet email existe déjà');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }

  async login(credentials: LoginCredentialsDto) {
    const { email, password } = credentials;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
    if (!user) {
      throw new NotFoundException('Utilisateur ou mot de passe incorrect');
    }
    const hashedPassword = await bcrypt.hash(password, user.salt);
    if (user.password !== hashedPassword) {
      throw new NotFoundException('Mot de passe incorrect');
    }
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    const jwt = this.jwtService.sign(payload);
    return {
      accessToken: jwt,
    };
  }

  async sendPasswordResetCode(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('Admin non trouvé');
    }

    // Générer un code de sécurité et le sauvegarder avec un horodatage d'expiration
    const resetCode = randomBytes(4).toString('hex');
    const resetCodeExpiration = new Date(Date.now() + 3600000); // Expiration dans 1 heure

    user.resetCode = resetCode;
    user.resetCodeExpiration = resetCodeExpiration;
    await this.userRepository.save(user);

    console.log('hiii');

    // Appeler directement la fonction sendReinitialisationEmail
    await this.mailService.sendReinitialisationEmail({
      resetcode: user.resetCode,
      email: user.email,
      name: user.firstName + ' ' + user.lastName,
    });
  }

  async verifyResetCode(email: string, code: string): Promise<boolean> {
    // Trouver l'admin par e-email
    const user = await this.userRepository.findOneBy({ email });

    // Vérifier si l'admin existe et si le code de réinitialisation correspond et n'est pas expiré
    if (
      !user ||
      user.resetCode !== code ||
      user.resetCodeExpiration < new Date()
    ) {
      return false;
    }

    return true;
  }

  async resetPassword(
    email: string,
    newPassword: string,
    code: string,
  ): Promise<void> {
    // Vérifier le code de réinitialisation
    const isCodeValid = await this.verifyResetCode(email, code);
    if (!isCodeValid) {
      throw new ConflictException(
        'Code de réinitialisation invalide ou expiré',
      );
    }

    // Trouver l'admin et mettre à jour le mot de passe
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('Admin non trouvé');
    }

    // Hasher le nouveau mot de passe
    user.password = await bcrypt.hash(newPassword, user.salt);
    user.resetCode = null;
    user.resetCodeExpiration = null;

    await this.userRepository.save(user);
  }
}
