import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInResponseDto } from './dtos/signin-response.dto';
import { PrismaService } from 'prisma.service';

import * as bcrypt from 'bcryptjs';
import { SignInDto } from './dtos/signin.dto';
import { UserNotFoundError } from 'users/user.errors';
import { InvalidPasswordError } from './auth.errors';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn({ username, password }: SignInDto): Promise<SignInResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    // Check if user exists
    if (!user) throw UserNotFoundError;

    // Check password
    if (!this.validatePassword(password, user.password))
      throw InvalidPasswordError;

    // Remove the user password
    delete user.password;

    // Return token and information
    return {
      token: this.jwtService.sign({ id: user.id }, { expiresIn: '7d' }),
      user,
    };
  }

  validatePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}
