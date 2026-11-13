import { Global, Module } from '@nestjs/common';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from './stripe.constants';
import { ConfigService } from '@nestjs/config';
import { Env } from '../config/env.schema';

@Global()
@Module({
  providers: [
    {
      provide: STRIPE_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) =>
        new Stripe(config.get('STRIPE_SECRET_KEY', { infer: true })),
    },
  ],
  exports: [STRIPE_CLIENT],
})
export class StripeModule {}