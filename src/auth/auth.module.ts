import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'prisma.service';
import { LoggedGuard } from './logged.guard';
import { JwtStrategy } from './jwt.strategy';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    JwtStrategy,
    LoggedGuard,
    PrismaService,
  ],
  exports: [LoggedGuard],
})
export class AuthModule {}
