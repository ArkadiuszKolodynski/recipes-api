import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { JwtDto } from './dto/jwt.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { UserPayloadDto } from './dto/user-payload.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly usersService: UsersService) {}

  async login(user: UserDto): Promise<JwtDto> {
    const payload: UserPayloadDto = { username: user.username, sub: user.id, isAdmin: user.isAdmin };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validateUser(username: string, password: string): Promise<UserDto | null> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;
      return rest;
    }
    return null;
  }
}
