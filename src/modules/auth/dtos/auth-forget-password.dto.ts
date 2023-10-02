import { IsEmail } from 'class-validator';

export class AuthForgetPassword {
  @IsEmail({}, { message: 'Invalid email' })
  email: string;
}
