import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserDTO } from './dtos/user-create.dto';
import { User } from './models/user.model';
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
}
