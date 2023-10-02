import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const resp = ctx.getResponse<Response>();
    console.log(exception.message);
    // const message = exception.message.match(/\. ([^.]*)\.$/)[1];

    let erroStatus: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    switch (exception.code) {
      case 'P2025':
        erroStatus = HttpStatus.NOT_FOUND;
        break;
      case 'P2002':
        erroStatus = HttpStatus.BAD_REQUEST;
        break;
      case 'P2003':
        erroStatus = HttpStatus.BAD_REQUEST;
        break;
      default:
        erroStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        break;
    }

    resp.status(erroStatus).json({
      statusCode: erroStatus,
      message: '',
    });
  }
}
