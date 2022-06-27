import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma.service';
import { CreateUserDTO } from './dtos/user-create.dto';
import { UsernameInUseError, UserNotFoundError } from './user.errors';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new user
   * @param userData User data to create
   * @returns The created user
   */
  async create(userData: CreateUserDTO) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: userData.username,
      },
    });

    // Check if username is already in user
    if (user) throw UsernameInUseError;

    // Creates the new user
    return await this.prisma.user.create({
      data: userData,
      include: {
        PlayerInGame: true,
      },
    });
  }

  /**
   * Find a user by its id.
   * @param id User id to find
   * @returns The found user
   */
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
    if (!user) throw UserNotFoundError;

    return user;
  }
}
