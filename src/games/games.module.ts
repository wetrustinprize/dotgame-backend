import { Module } from '@nestjs/common';
import { GamesResolver } from './games.resolver';
import { GamesService } from './games.service';

@Module({
  providers: [GamesService, GamesResolver],
})
export class GamesModule {}
