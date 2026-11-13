import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AppThrottlerGuard } from './app-throttler.guard';

@Injectable()
export class UserThrottleGuard extends AppThrottlerGuard {
  protected getTracker(req: Request): Promise<string> {
    if (!req.user) {
      throw new Error('UserThrottleGuard used on a route without JwtGuard');
    }

    return Promise.resolve(req.user.id);
  }
}