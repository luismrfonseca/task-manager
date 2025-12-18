import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: { userId: string; email: string } }) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('push-token')
  async updatePushToken(
    @Request() req: { user: { userId: string } },
    @Body('pushToken') pushToken: string,
  ) {
    return this.usersService.updatePushToken(req.user.userId, pushToken);
  }
}
