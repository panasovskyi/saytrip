import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiError } from '../exceptions/api-error.exception';
import { CreateUserData, UserWithSubscription } from './user.types';
import { SubscriptionService } from '../subscription/subscription.service';
import { Prisma } from '../generated/prisma/client';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async findById(id: string): Promise<UserWithSubscription | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { subscription: true },
    });

    return user;
  }

  async findByEmail(email: string): Promise<UserWithSubscription | null> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { subscription: true },
    });

    return user;
  }

  async create({
    email,
    passwordHash,
    termsAcceptedAt,
    name,
  }: CreateUserData): Promise<UserWithSubscription> {
    try {
      return await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          termsAcceptedAt,
          name,
          passwordHash,
        },
      });

      const subscription = await this.subscriptionService.createFree(
        user.id,
        tx,
      );

      return { ...user, subscription };
    });
    }
    catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw ApiError.conflict("Email is taken");
      }

      throw error
    }
  }
}
