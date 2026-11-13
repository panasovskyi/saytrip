import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { Env } from './config/env.schema';
import { ExceptionsFilter } from './exceptions/exceptions.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  const config = app.get<ConfigService<Env, true>>(ConfigService);

  const origins = [
    config.get('CLIENT_URL', { infer: true }),
    config.get('ADMIN_URL', { infer: true }),
  ].filter((url): url is string => Boolean(url));

  const trustProxy = config.get('TRUST_PROXY', { infer: true });

  if (trustProxy) {
    app.set('trust proxy', trustProxy);
  }

  app.use(helmet());
  app.enableCors({ origin: origins, credentials: true });
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new ExceptionsFilter());
  app.enableShutdownHooks();
  app.use(cookieParser());
  await app.listen(config.get('PORT', { infer: true }));
}
void bootstrap();
