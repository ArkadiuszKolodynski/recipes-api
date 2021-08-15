import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtDto } from './dto/jwt.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { PublicRoute } from './decorators/public-route.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @PublicRoute()
  @UseGuards(LocalAuthGuard)
  login(@Request() req): Promise<JwtDto> {
    return this.authService.login(req.user);
  }
}
