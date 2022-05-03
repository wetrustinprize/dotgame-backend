import { User } from '@generated/prisma/user/models/user.model';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignInResponseDto {
  @Field(() => String, {
    nullable: false,
    description: 'Json web token with the user information',
  })
  token: string;

  @Field(() => User, {
    nullable: false,
    description: 'Current user information',
  })
  user: User;
}
