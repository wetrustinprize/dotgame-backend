import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDTO } from './dtos/user-create.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userData: CreateUserDTO): Promise<User> {
    return await this.prisma.user.create({
      data: userData,
      include: {
        PlayerInGame: true,
      },
    });
  }

  async findById(id: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        PlayerInGame: true,
      },
    });
  }
}
