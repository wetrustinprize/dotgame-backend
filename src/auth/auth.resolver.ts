import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignInResponseDto } from './dtos/signin-response.dto';
import { SignInDto } from './dtos/signin.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignInResponseDto)
  async signIn(@Args() signInData: SignInDto): Promise<SignInResponseDto> {
    return this.authService.signIn(signInData);
  }
}
