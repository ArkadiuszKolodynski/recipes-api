import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({ log: [{ emit: 'event', level: 'query' }] });
  }

  async onModuleInit() {
    await this.$connect();

    // log db queries
    this.$on('query' as any, async (e: Prisma.QueryEvent) => {
      this.logger.debug(`(${e.duration}ms) ${e.query}`);
      this.logger.debug(`Params: ${e.params}`);
    });

    // hash password on User.create
    this.$use(async (params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<any>) => {
      if (params.model === Prisma.ModelName.User && (params.action === 'create' || params.action === 'update')) {
        if (params.args.data.password) {
          params.args.data.password = await bcrypt.hash(params.args.data.password, 10);
        }
      }
      return await next(params);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
