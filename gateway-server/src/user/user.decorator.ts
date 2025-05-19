import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from './userPayload.interface';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
