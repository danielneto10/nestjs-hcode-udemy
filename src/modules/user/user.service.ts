import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdatePartialUserDto } from './dtos/update-partial-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    if (await this.findByEmail(data.email)) {
      throw new UnprocessableEntityException('Email already exists');
    }

    const createdUser = await this.prisma.user.create({
      data: {
        ...data,
        password: await bcrypt.hash(data.password, 10),
      },
    });

    return UserResponseDto.mapToUserResponse(createdUser);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany();

    return UserResponseDto.mapToUserResponseList(users);
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return UserResponseDto.mapToUserResponse(user);
  }

  async findAllByQuery(query: string): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
            },
          },
          {
            email: {
              contains: query,
            },
          },
        ],
      },
    });

    return UserResponseDto.mapToUserResponseList(users);
  }

  async update(
    id: number,
    data: UpdateUserDto | UpdatePartialUserDto,
  ): Promise<UserResponseDto> {
    if (data.email) {
      const user = await this.findByEmail(data.email);

      if (user && user.id !== id) {
        throw new BadRequestException('Email already exists');
      }
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        birthAt: data.birthAt ? new Date(data.birthAt) : undefined,
        password: data.password
          ? await bcrypt.hash(data.password, 10)
          : undefined,
      },
    });

    return UserResponseDto.mapToUserResponse(user);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async userExist(id: number): Promise<boolean> {
    const userCount = await this.prisma.user.count({
      where: { id },
    });

    return userCount > 0;
  }
}
