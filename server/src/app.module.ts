import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { HealthController } from './health/health.controller';
import { validateEnv } from './config/env.schema';
import { SuggestionModule } from './suggestion/suggestion.module';
import { AiModule } from './ai/ai.module';
import { DestinationModule } from './destination/destination.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { StripeModule } from './stripe/stripe.module';
import { BillingModule } from './billing/billing.module';

@Module({
  imports: [
    StripeModule,
    PrismaModule,
    UserModule,
    AuthModule,
    SubscriptionModule,
    BillingModule,
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60_000, limit: 20 }],
      errorMessage: 'Too many requests. Please try again in a minute.',
    }),
    SuggestionModule,
    AiModule,
    DestinationModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
