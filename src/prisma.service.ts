import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();

    // Hash password Create/Update
    this.$use(async (params, next) => {
      if (
        (params.action === 'create' || params.action === 'update') &&
        params.model === 'User'
      ) {
        const { password } = params.args.data;

        if (!password) return next(params);

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        params.args.data = { ...params.args.data, password: hash };
      }

      return next(params);
    });
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
