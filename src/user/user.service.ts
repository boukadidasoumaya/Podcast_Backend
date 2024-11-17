import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserRoleEnum } from '../shared/Enums/user-role.enum';
import { PaymentService } from '../payment/payment.service';
import { CreatePaymentDto } from '../payment/dto/create-payment.dto';
import { Payment } from '../payment/entities/payment.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Payment)
    private readonly paymentService: PaymentService,
  ) {}

  async findAllUsers(currentUser: User) {
    if (currentUser.role == UserRoleEnum.SUPER_ADMIN) {
      const users = await this.userRepository.find();
      return users.map((user) => {
        return {
          id: user.id,
          firstnName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        };
      });
    }
    throw new UnauthorizedException('Non autorisé');
  }

  async findOne(id: number, currentUser: User) {
    if (currentUser.role == UserRoleEnum.ADMIN) {
      id = currentUser.id;
    }
    const user = await this.userRepository.findOneBy({
      id,
      deletedAt: IsNull(),
    });
    if (!user) {
      throw new ConflictException('Utilisateur non trouvé');
    }
    return {
      id: user.id,
      firstnName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async update(id: number, updateUserDto: UpdateUserDto, currentUser: User) {
    // Éliminer la mise à jour du mot de passe
    if (updateUserDto.password) {
      throw new UnauthorizedException('Non autorisé');
    }

    // Vérifier si l'email est unique
    if (updateUserDto.email) {
      const existingUser = await this.userRepository.findOneBy({
        email: updateUserDto.email,
        id: Not(id),
      });
      if (existingUser) {
        throw new ConflictException('Cet email est déjà utilisé');
      }
    }

    if (
      currentUser.id === id ||
      currentUser.role === UserRoleEnum.SUPER_ADMIN
    ) {
      return await this.userRepository.update(id, updateUserDto);
    }

    throw new UnauthorizedException('Non autorisé');
  }

  async changePassword(user: User, changePasswordDto: ChangePasswordDto) {
    const { oldPassword, newPassword } = changePasswordDto;
    const userData = await this.userRepository.findOneBy({ id: user.id });
    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      userData.password,
    );
    if (!isPasswordValid) {
      throw new NotFoundException('Mot de passe ancien invalide');
    }
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);
    user.salt = salt;
    await this.userRepository.save(user);
    return {
      id: user.id,
      email: user.email,
      firstnName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }

  async softRemove(id: number, currentUser: User) {
    if (currentUser.role == UserRoleEnum.SUPER_ADMIN) {
      return await this.userRepository.softDelete(id);
    }
    throw new UnauthorizedException('Non autorisé');
  }
  async restoreUserById(id: number, currentUser: User) {
    if (currentUser.role == UserRoleEnum.SUPER_ADMIN) {
      const user = await this.userRepository.findOne({
        where: { id },
        withDeleted: true,
      });

      if (!user) {
        throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
      }

      await this.userRepository.restore(id);
      return user;
    }
    throw new UnauthorizedException('Non autorisé');
  }
  async restoreUserByEmail(email: string, currentUser: User) {
    if (currentUser.role === UserRoleEnum.SUPER_ADMIN) {
      const user = await this.userRepository.findOne({
        where: { email },
        withDeleted: true,
      });

      if (!user) {
        throw new NotFoundException(
          `Utilisateur avec l'email ${email} non trouvé`,
        );
      }

      // Restore the user
      await this.userRepository.restore(user.id);
      return user;
    }

    throw new UnauthorizedException('Non autorisé');
  }
  async upgradeUserToPremium(
    userId: number,
    createPaymentDto: CreatePaymentDto,
  ): Promise<{ message: string; premiumUntil: Date }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['payments'], // Charger les paiements existants
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Créer le paiement via le PaymentService
    await this.paymentService.createPayment(user, createPaymentDto);

    // Retourner un message de succès avec la date d'expiration
    return {
      message:
        'Le paiement a été effectué avec succès. Vous êtes maintenant Premium.',
      premiumUntil: createPaymentDto.expirationDate,
    };
  }
}
