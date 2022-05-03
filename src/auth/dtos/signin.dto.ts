import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class SignInDto {
  @Field({ description: 'The username of the user' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field({ description: 'The password of the user' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
