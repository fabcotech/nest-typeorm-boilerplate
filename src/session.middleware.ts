import {
  Injectable,
  NestMiddleware,
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';
import { Session } from './entities/session';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(private dataSource: DataSource) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.cookies || !req.cookies['session']) {
      next();
      return;
    }
    const session = await this.dataSource
      .getRepository(Session)
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.user', 'user')
      .where({ token: req.cookies['session'] })
      .getOne();
    if (
      session &&
      new Date(session.validUntil).getTime() > new Date().getTime()
    ) {
      (req as any).user = {
        id: session.user.id,
        email: session.user.email,
        createdAt: session.user.createdAt,
        updatedAt: session.user.updatedAt,
      };
    } else {
      await this.dataSource
        .getRepository(Session)
        .createQueryBuilder('session')
        .delete()
        .from(Session)
        .where({ token: req.cookies['session'] })
        .execute();
      res.clearCookie('session');
    }

    next();
  }
}

export const UserOrThrow = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) throw new UnauthorizedException();
    return request.user;
  }
);
