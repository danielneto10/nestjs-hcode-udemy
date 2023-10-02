import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { FileService } from '../file/file.service';
import { FileValidatorPipe } from '../file/pipes/file-validator.pipe';
import { User } from '../user/models/user.model';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/currentuser.decorator';
import { AuthForgetPassword } from './dtos/auth-forget-password.dto';
import { AuthRegister } from './dtos/auth-register.dto';
import { AuthResetPassword } from './dtos/auth-reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { AuthRequest } from './models/auth-request.model';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly fileService: FileService,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: AuthRequest) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() userRegister: AuthRegister) {
    return this.authService.register(userRegister);
  }

  @Post('forget-password')
  async forgetPassword(@Body() userForgetPassword: AuthForgetPassword) {
    return this.authService.forgetPassword(userForgetPassword);
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() userReset: AuthResetPassword,
  ) {
    return this.authService.resetPassword(userReset.password, token);
  }

  @Post('photo')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @CurrentUser() user: User,
    @UploadedFile(new FileValidatorPipe()) photo: Express.Multer.File,
  ) {
    const path = join(
      __dirname,
      '../../../storage/photos',
      `photo-${user.id}.png`,
    );

    return await this.fileService.uploadFile(photo, path);
  }
}
