import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma.service';
import { CreateUserDTO } from './dtos/user-create.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userData: CreateUserDTO) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: userData.username,
      },
    });

    // Check if username is already in user
    if (user) throw new BadRequestException('username_in_use');

    // Creates the new user
    return await this.prisma.user.create({
      data: userData,
      include: {
        PlayerInGame: true,
      },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        PlayerInGame: true,
      },
    });

    // Check if user exists
    if (!user) throw new NotFoundException('user_not_found');

    return user;
  }
}
