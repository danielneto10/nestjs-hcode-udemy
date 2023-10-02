import { Expose, Transform, plainToClass } from 'class-transformer';
import { Role } from 'src/utils/enums/role.enum';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  birthAt: Date;

  @Expose()
  @Transform(({ value }) => Role[value])
  role: string;

  static mapToUserResponse(data: any) {
    return plainToClass(UserResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }

  static mapToUserResponseList(data: any[]) {
    return data.map((item) => this.mapToUserResponse(item));
  }
}
