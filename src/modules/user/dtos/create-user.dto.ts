import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Matches,
  MinLength,
} from 'class-validator';
import { Role } from 'src/utils/enums/role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @Matches(/^[a-zA-Z\s]*$/, {
    message: 'Name must contain only letters and spaces',
  })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

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

  @IsOptional()
  @IsDateString()
  birthAt?: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Invalid role' })
  role?: number;
}
