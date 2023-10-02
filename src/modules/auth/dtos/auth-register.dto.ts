import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/modules/user/dtos/create-user.dto';

export class AuthRegister extends OmitType(CreateUserDto, ['role'] as const) {}
