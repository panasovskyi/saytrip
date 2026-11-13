import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { Env } from '../config/env.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService<Env, true>) {
    const databaseUrl = configService.get('DATABASE_URL', {
      infer: true,
    });
    const nodeEnv = configService.get('NODE_ENV', {
      infer: true,
    });

    const adapter = new PrismaPg({
      connectionString: databaseUrl,
    });

    super({
      adapter,
      log: nodeEnv === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
