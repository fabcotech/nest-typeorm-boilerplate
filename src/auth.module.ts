import {
  Controller,
  Post,
  Get,
  Injectable,
  Module,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DataSource } from 'typeorm';
import * as blake2 from 'blake2';

import { day, getRandomCode, sec } from './utils';
import { DatabaseModule } from './databaseProvider';
import { User, UserMinimal } from './entities/user';
import { Session } from './entities/session';
import { UserOrThrow } from './session.middleware';

interface AuthenticateResponse {
  token: string;
  success: boolean;
  errorMessage: string;
}

@Injectable()
export class AuthService {
  constructor(private dataSource: DataSource) {}

  async getUser(email: string) {
    return await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .where({ email })
      .getOne();
  }

  async getUserVerified(email: string) {
    return await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .where({ email })
      .andWhere(`"verifiedAt" IS NOT NULL`)
      .getOne();
  }

  async createUser(email: string, hashedPassword: string) {
    await this.dataSource
      .getRepository(User)
      .insert({ email, password: hashedPassword });
    return await this.getUser(email);
  }

  async createSession(user: User) {
    const tokenLength = 20;
    const token = getRandomCode(tokenLength);
    const daysInAYear = 365;
    await this.dataSource.getRepository(Session).insert({
      userId: user.id,
      user: user.id,
      validUntil: new Date(
        new Date().getTime() + day * daysInAYear
      ).toISOString(),
      token,
    } as any);
    return token;
  }
}

@Controller({
  path: 'auth',
})
export class AuthController {
  constructor(
    private authService: AuthService,
    private dataSource: DataSource
  ) {}

  @Get('/me')
  async me(@UserOrThrow('user') user: UserMinimal): Promise<UserMinimal> {
    return user;
  }

  @Post('/login')
  async login(
    @Query('password') password: string,
    @Query('email') email: string,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ): Promise<AuthenticateResponse> {
    console.log('login post');
    const h = blake2.createHash('blake2b');
    h.update(Buffer.from(password));
    const hashedPassword = h.digest('hex');
    console.log('password', password);
    console.log('hashedPassword', hashedPassword);
    const user = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .where({ email, password: hashedPassword })
      .andWhere(`'verifiedAt' IS NOT NULL`)
      .getOne();
    if (!user) throw new Error('User not found');
    const token = await this.authService.createSession(user);
    response.cookie('session', token);

    return {
      success: true,
      token: token,
      errorMessage: '',
    };
  }

  @Post('/signup')
  async signup(
    @Query('password') password: string,
    @Query('email') email: string,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ): Promise<AuthenticateResponse> {
    console.log('signup post');
    const h = blake2.createHash('blake2b');
    h.update(Buffer.from(password));
    const hashedPassword = h.digest('hex');
    console.log('password', password);
    console.log('hashedPassword', hashedPassword);
    const userVerified = await this.authService.getUserVerified(email);
    if (userVerified) throw new Error('User already exists');
    const user = await this.authService.createUser(email, hashedPassword);
    const token = await this.authService.createSession(user);
    response.cookie('session', token);

    return {
      success: true,
      token: token,
      errorMessage: '',
    };
  }
}

@Module({
  controllers: [AuthController],
  imports: [DatabaseModule],
  providers: [AuthService],
})
export class AuthModule {}
