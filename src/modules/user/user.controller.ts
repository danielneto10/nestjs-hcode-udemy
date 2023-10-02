import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ParamId } from 'src/utils/decorators/param-id.decorator';
import { Role } from 'src/utils/enums/role.enum';
import { CurrentUser } from '../auth/decorators/currentuser.decorator';
import { Roles } from '../auth/decorators/role.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateCurrentUserDto } from './dtos/update-current-user.dto';
import { UpdatePartialUserDto } from './dtos/update-partial-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './models/user.model';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() createDto: CreateUserDto) {
    return this.userService.create(createDto);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @Roles(Role.ADMIN)
  async findAll(@Query('search') search?: string) {
    if (search) {
      return this.userService.findAllByQuery(search);
    }

    return this.userService.findAll();
  }

  @Get('me')
  @Roles(Role.ADMIN, Role.USER)
  async me(@CurrentUser() user: User) {
    return this.userService.findOne(user.id);
  }

  @Patch('me')
  @Roles(Role.ADMIN, Role.USER)
  async updateMe(
    @CurrentUser() user: User,
    @Body() updateCurrentUser: UpdateCurrentUserDto,
  ) {
    return this.userService.update(user.id, updateCurrentUser);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  async findOne(@ParamId() id: number) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateDto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  async updatePartial(
    @ParamId() id: number,
    @Body() updatePartialDto: UpdatePartialUserDto,
  ) {
    return this.userService.update(id, updatePartialDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async delete(@ParamId() id: number) {
    return this.userService.delete(id);
  }
}
