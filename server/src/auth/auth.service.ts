import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegistrationPayload } from './schemas/registration.schema';
import bcrypt from 'bcrypt';
import { PublicUser } from '../user/user.types';
import { LoginPayload } from './schemas/login.schema';
import { ApiError } from '../exceptions/api-error.exception';
import { LoginResponse, TokenPayload } from './auth.types';
import { JwtService } from '@nestjs/jwt';
import { toPublicUser } from '../user/user.mapper';

const SALT_ROUNDS = 10;
const MOCK_PASSWORD_HASH = bcrypt.hashSync('mock-password', SALT_ROUNDS);

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService,
    private readonly jwt: JwtService
  ) {}

  async register({
    email,
    password,
    name,
    termsAcceptedAt,
  }: RegistrationPayload): Promise<PublicUser> {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await this.userService.create({
      email,
      termsAcceptedAt,
      name,
      passwordHash,
    });

    return toPublicUser(user);
  }

  async login({ email, password }: LoginPayload): Promise<LoginResponse> {
    const user = await this.userService.findByEmail(email);
    const isPasswordMatch = await bcrypt.compare(
      password,
      user?.passwordHash || MOCK_PASSWORD_HASH,
    );

    if (!user || !isPasswordMatch) {
      throw ApiError.unauthorized('Wrong email and/or password');
    };

    const tokenPayload: TokenPayload = {
      id: user.id,
    };

    const accessToken = this.jwt.sign(tokenPayload);

    return {
      accessToken,
      user: toPublicUser(user),
    };

  }

  async getMe(id: string): Promise<PublicUser> {
    const user = await this.userService.findById(id);

    if (!user) {
      throw ApiError.unauthorized('Session is no longer valid');
    }

    return toPublicUser(user);
  }
}