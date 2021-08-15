import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtDto } from './dto/jwt.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { PublicRoute } from './decorators/public-route.decorator';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UsersService) {}

  @PublicRoute()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Req() req: Request): Promise<JwtDto> {
    return this.authService.login(req.user);
  }

  @PublicRoute()
  @Post('register')
  async register(@Body() userInfo: CreateUserDto): Promise<void> {
    await this.userService.create(userInfo);
  }
}
