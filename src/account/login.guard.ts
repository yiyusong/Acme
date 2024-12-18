import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { DON_NEED_TOKEN } from '../utils/decorators/login.decorator';
import { Request } from 'express';
import { UnLoginException } from 'src/utils/filters/unLogin.filter';

@Injectable()
export class LoginGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const isNoToken = this.reflector.getAllAndOverride<boolean>(
      DON_NEED_TOKEN,
      [context.getHandler(), context.getClass()],
    );

    if (isNoToken) {
      return true;
    }

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnLoginException();
    }

    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (info || err) throw new UnLoginException();
    if (!user) throw new UnLoginException();
    return user;
  }
}
