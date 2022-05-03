import { User } from '@generated/prisma/user/models/user.model';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'auth/current-user.decorator';
import { LoggedGuard } from 'auth/logged.guard';
import { CreateUserDTO } from './dtos/user-create.dto';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(@Args() userData: CreateUserDTO): Promise<User> {
    return (await this.usersService.create(userData)) as User;
  }

  @Query(() => User)
  async getUserById(@Args('id') id: string): Promise<User> {
    return (await this.usersService.findById(id)) as User;
  }

  @Query(() => User)
  @UseGuards(LoggedGuard)
  async getLoggedUser(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
