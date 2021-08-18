import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtDto } from './dto/jwt.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { PublicRoute } from './decorators/public-route.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: CreateUserDto })
  @ApiBadRequestResponse({ description: 'Wrong payload' })
  @ApiUnauthorizedResponse({ description: 'Wrong credentials' })
  @PublicRoute()
  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  login(@Req() req: Request): Promise<JwtDto> {
    return this.authService.login(req.user);
  }

  @PublicRoute()
  @ApiBadRequestResponse({ description: 'Wrong payload' })
  @Post('register')
  async register(@Body() userInfo: CreateUserDto): Promise<void> {
    await this.authService.register(userInfo);
  }
}
