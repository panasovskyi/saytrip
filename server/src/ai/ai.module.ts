import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import Anthropic from '@anthropic-ai/sdk';
import { ConfigService } from '@nestjs/config';
import { Env } from '../config/env.schema';

const anthropicProvider = {
  provide: Anthropic,
  inject: [ConfigService],
  useFactory: (config: ConfigService<Env, true>) =>
    new Anthropic({ apiKey: config.get('ANTHROPIC_API_KEY', { infer: true }) }),
};

@Module({
  imports: [],
  controllers: [],
  providers: [AiService, anthropicProvider],
  exports: [AiService],
})
export class AiModule {}
