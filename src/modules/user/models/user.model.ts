import { Expose, plainToClass } from 'class-transformer';

export class User {
  @Expose()
  id?: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  password?: string;

  @Expose()
  birthAt: Date;

  @Expose()
  role: number;

  @Expose()
  createdAt?: Date;

  @Expose()
  updatedAt?: Date;

  static mapToUser(user: any): User {
    return plainToClass(User, user, { excludeExtraneousValues: true });
  }
}
