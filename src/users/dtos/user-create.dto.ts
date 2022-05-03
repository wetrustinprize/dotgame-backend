import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

@ArgsType()
export class CreateUserDTO {
  @Field({ description: 'The username of the user' })
  @Field()
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field({ description: 'The password of the user, minimum of 6 characters.' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
