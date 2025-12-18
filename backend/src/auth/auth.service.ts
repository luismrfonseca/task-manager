import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from '@shared/index';

import { User } from '@prisma/client';

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findOne(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: { email: string; id: string }): Promise<Tokens> {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET') || 'secretKey',
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret:
        this.configService.get<string>('JWT_REFRESH_SECRET') ||
        'refreshSecretKey',
      expiresIn: '7d',
    });

    await this.usersService.updateRefreshToken(
      user.id,
      await bcrypt.hash(refreshToken, 10),
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async logout(userId: string) {
    return this.usersService.updateRefreshToken(userId, null);
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET') || 'secretKey',
      expiresIn: '15m',
    });
    const newRefreshToken = this.jwtService.sign(payload, {
      secret:
        this.configService.get<string>('JWT_REFRESH_SECRET') ||
        'refreshSecretKey',
      expiresIn: '7d',
    });

    await this.usersService.updateRefreshToken(
      user.id,
      await bcrypt.hash(newRefreshToken, 10),
    );

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken,
    };
  }

  async signUp(createUserDto: CreateUserDTO) {
    this.validatePasswordStrength(createUserDto.password!);
    const hash = await bcrypt.hash(createUserDto.password!, 10);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hash,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = newUser;
    return this.login(result);
  }

  private validatePasswordStrength(password: string) {
    if (password.length < 8) {
      throw new BadRequestException(
        'Password must be at least 8 characters long',
      );
    }
    if (!/[0-9]/.test(password)) {
      throw new BadRequestException('Password must contain at least 1 number');
    }
    if (!/[!@#$%^&*]/.test(password)) {
      throw new BadRequestException(
        'Password must contain at least 1 special character',
      );
    }
  }
}
