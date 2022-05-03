import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService, UsersResolver, PrismaService],
})
export class UsersModule {}
