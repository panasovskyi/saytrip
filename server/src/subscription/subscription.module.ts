import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [],
  controllers: [],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}