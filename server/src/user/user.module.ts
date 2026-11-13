import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [SubscriptionModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
