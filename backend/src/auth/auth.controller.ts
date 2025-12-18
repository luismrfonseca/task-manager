import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '@shared/index';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    sub: string;
    refreshToken?: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDTO) {
    return this.authService.signUp(createUserDto);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  async login(@Body() loginDto: CreateUserDTO) {
    // In a real app we might use LocalGuard which puts user in req.user
    // For now let's just accept body if we didn't implement LocalStrategy fully yet
    // But better implementation: Validate credentials here manually if we skip LocalStrategy
    if (!loginDto.password)
      throw new UnauthorizedException('Password required');
    const valid = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!valid) throw new UnauthorizedException();
    return this.authService.login(valid);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() req: RequestWithUser) {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: RequestWithUser) {
    return this.authService.logout(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@Req() req: RequestWithUser) {
    if (!req.user.refreshToken)
      throw new UnauthorizedException('Refresh token is missing');
    return this.authService.refreshTokens(req.user.sub, req.user.refreshToken);
  }
}
