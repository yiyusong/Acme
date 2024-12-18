import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

export class UnLoginException {
  message?: string;

  constructor(message?: string) {
    this.message = message;
  }
}

@Catch(UnLoginException)
export class UnLoginFilter implements ExceptionFilter {
  catch(exception: UnLoginException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    response.json({
      message: exception.message || '请先登录',
      code: HttpStatus.UNAUTHORIZED,
    });
  }
}
