import { Injectable, Logger, NotFoundException, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({ log: [{ emit: 'event', level: 'query' }], rejectOnNotFound: () => new NotFoundException() });
  }

  async onModuleInit() {
    await this.$connect();

    // log db queries
    this.$on('query' as any, async (e: any) => {
      this.logger.debug(`(${e.duration}ms) ${e.query}`);
      this.logger.debug(`Params: ${e.params}`);
    });

    // hash password on User.create
    this.$use(async (params, next) => {
      if (params.action === 'create' && params.model === Prisma.ModelName.User) {
        params.args.data.password = await bcrypt.hash(params.args.data.password, 10);
      }
      return await next(params);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
