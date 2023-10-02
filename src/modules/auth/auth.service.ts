import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/models/user.model';
import { UserService } from '../user/user.service';
import { AuthForgetPassword } from './dtos/auth-forget-password.dto';
import { AuthRegister } from './dtos/auth-register.dto';
import { UserJwtPayload } from './models/user-jwt-payload.model';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);

    if (user) {
      const matchPassword = await bcrypt.compare(password, user.password);

      if (matchPassword) {
        const result = user;

        delete result.password;

        return result;
      }
    }

    return null;
  }

  async createTokenUser(user: User, options?: JwtSignOptions) {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    } as UserJwtPayload;

    return {
      token: this.jwtService.sign(payload, options),
    };
  }

  async verifyToken(token: string, options?: JwtSignOptions) {
    try {
      const payload = this.jwtService.verify<UserJwtPayload>(token, options);

      return payload;
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
  }

  async login(userLogin: User) {
    const tokenObject = await this.createTokenUser(userLogin, {
      expiresIn: '1d',
      audience: 'login',
    });

    return tokenObject;
  }

  async register(userRegister: AuthRegister) {
    // TODO send email register confirmation

    return this.userService.create(userRegister);
  }

  async forgetPassword(userForgetPassword: AuthForgetPassword) {
    const user = await this.userService.findByEmail(userForgetPassword.email);

    if (user) {
      const { token } = await this.createTokenUser(user, {
        audience: 'forget-password',
        expiresIn: '10 minutes',
      });

      await this.mailerService.sendMail({
        subject: 'Forget password',
        to: userForgetPassword.email,
        template: 'forget',
        context: {
          name: user.name,
          link: `http://localhost:3000/auth/reset-password/${token}`,
          token: token,
        },
      });
    }

    return {
      message: `If the email ${userForgetPassword.email} exists, a message will be sent with instructions to reset your password`,
    };
  }

  async resetPassword(password: string, token: string) {
    const user = await this.verifyToken(token, {
      audience: 'forget-password',
    });

    this.userService.update(user.sub, { password });

    return {
      message: 'Password reset successfully',
    };
  }
}
