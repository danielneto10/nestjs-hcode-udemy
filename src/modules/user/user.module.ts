import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma/prisma.module';
import { UserNotExistMiddleware } from './middlewares/user-exist.middleware';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserNotExistMiddleware)
      .exclude(
        { path: 'users/:id', method: RequestMethod.GET },
        { path: 'users/me', method: RequestMethod.PATCH },
      )
      .forRoutes({ path: 'users/:id', method: RequestMethod.ALL });
  }
}
