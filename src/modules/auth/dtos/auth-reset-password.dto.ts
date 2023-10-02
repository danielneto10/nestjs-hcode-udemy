import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class AuthResetPassword {
  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must be at least 8 characters and contain at least 1 lowercase, 1 uppercase, 1 number and 1 symbol',
    },
  )
  password: string;
}
