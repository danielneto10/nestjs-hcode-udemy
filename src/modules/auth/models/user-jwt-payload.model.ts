export class UserJwtPayload {
  sub: number;
  name: string;
  email: string;
  role: number;
  iat?: number;
  exp?: number;
  aud?: string;
}
