import { Injectable } from '@nestjs/common';
import { AppThrottlerGuard } from './app-throttler.guard';

@Injectable()
export class LoginThrottlerGuard extends AppThrottlerGuard {
  protected getTracker(req: Record<string, any>): Promise<string> {
    const body = req.body as { email?: unknown } | undefined;
    const email =
      typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    return Promise.resolve(email || req.ip);
  }
}
