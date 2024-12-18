import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class InvokeRecordInterceptor implements NestInterceptor {
  private logger = new Logger(InvokeRecordInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const userAgent = request.headers['user-agent'];
    const { method, body, ip, path } = request;
    this.logger.debug(
      `[${now}] ${method} ${path} ${ip} ${userAgent}: ${context.getClass().name} ${
        context.getHandler().name
      } body:${JSON.stringify(body)} invoked...`,
    );

    return next.handle().pipe(
      tap((res) => {
        this.logger.debug(
          `[${now}] [${Date.now() - now}ms] [${response.statusCode}]: Response: ${JSON.stringify(res)}`,
        );
      }),
    );
  }
}
