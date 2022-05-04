import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma.service';
import { GamesResolver } from './games.resolver';
import { GamesService } from './games.service';

@Module({
  providers: [GamesService, GamesResolver, PrismaService],
})
export class GamesModule {}
