import { Controller, Post, Body, UseGuards, Req, HttpCode, HttpStatus, Get, UnauthorizedException } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '@shared/index';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Post('signup')
    signup(@Body() createUserDto: CreateUserDTO) {
        return this.authService.signUp(createUserDto);
    }

    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Post('login')
    async login(@Body() req) {
        // In a real app we might use LocalGuard which puts user in req.user
        // For now let's just accept body if we didn't implement LocalStrategy fully yet
        // But better implementation: Validate credentials here manually if we skip LocalStrategy
        const valid = await this.authService.validateUser(req.email, req.password);
        if (!valid) throw new UnauthorizedException();
        return this.authService.login(valid);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Req() req: Request) {
        return req.user;
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@Req() req: Request) {
        const user = req.user as any;
        return this.authService.logout(user.userId);
    }

    @UseGuards(AuthGuard('jwt-refresh'))
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(@Req() req: Request) {
        const user = req.user as any;
        // user in refresh strategy usually contains payload + refreshToken?
        // refresh strategy validate returns { ...payload, refreshToken }
        return this.authService.refreshTokens(user.sub, user.refreshToken);
    }
}
