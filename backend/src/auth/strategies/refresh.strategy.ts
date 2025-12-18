import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'), // Or Bearer, plan says body for refresh endpoint usually
      secretOrKey:
        config.get<string>('JWT_REFRESH_SECRET') || 'refreshSecretKey',
      passReqToCallback: true,
    });
  }

  validate(
    req: Request,
    payload: { sub: string; email: string },
  ): { sub: string; email: string; refreshToken: string } {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = req.body;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const refreshToken = body.refresh_token as string;
    return { ...payload, refreshToken };
  }
}
