import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserService } from '../user.service';

@Injectable()
export class UserNotExistMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params.id);

    if (isNaN(id) || +id < 1) {
      throw new NotFoundException('User not found');
    }

    const user = await this.userService.userExist(+id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    next();
  }
}
