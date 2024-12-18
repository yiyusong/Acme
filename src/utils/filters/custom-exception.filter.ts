import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { isArray } from 'class-validator';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const res = exception.getResponse() as { message: string[] };
    console.log(res);
    let message = '';
    if (res?.message) {
      message = isArray(res.message) ? res.message.join(';') : res.message;
    }
    response
      .json({
        message: message || exception.message,
        code: exception.getStatus(),
      })
      .end();
  }
}
