import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma.service';

@Injectable()
export class GamesService {
  constructor(private readonly prismaService: PrismaService) {}
}
