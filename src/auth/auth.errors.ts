import { UnauthorizedException } from '@nestjs/common';

export const InvalidPasswordError = new UnauthorizedException(
  'password_incorrect',
);
