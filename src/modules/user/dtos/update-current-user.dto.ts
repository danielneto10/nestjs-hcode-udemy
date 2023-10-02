import { OmitType } from '@nestjs/mapped-types';
import { UpdateUserDto } from './update-user.dto';

export class UpdateCurrentUserDto extends OmitType(UpdateUserDto, ['role']) {}
