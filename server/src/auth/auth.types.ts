import { PublicUser } from '../user/user.types';

export type LoginResponse = {
  accessToken: string;
  user: PublicUser;
}

export type TokenPayload = {
  id: string;
}