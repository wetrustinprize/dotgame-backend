import { User } from '@generated/prisma/user/models/user.model';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignInResponseDto {
  @Field(() => String, { nullable: false })
  token: string;

  @Field(() => User, { nullable: false })
  user: User;
}
