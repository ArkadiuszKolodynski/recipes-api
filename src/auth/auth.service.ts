import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { JwtDto } from './dto/jwt.dto';
import { UserPayloadDto } from './dto/user-payload.dto';
import { User } from '@prisma/client';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly usersService: UsersService) {}

  async login(user: User): Promise<JwtDto> {
    const payload: UserPayloadDto = { username: user.username, sub: user.id, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(createUserDto: CreateUserDto): Promise<void> {
    await this.usersService.create(createUserDto);
  }

  async validateUserByCredentials(username: string, password: string): Promise<User> {
    const user = await this.usersService.findOneByUsername(username);
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async validateUserByPayload(payload: UserPayloadDto): Promise<User> {
    return await this.usersService.findOneById(payload.sub);
  }
}
