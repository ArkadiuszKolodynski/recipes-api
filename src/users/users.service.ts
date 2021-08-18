import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.prismaService.user.create({ data: createUserDto });
  }

  findOneById(id: number): Promise<User> {
    return this.prismaService.user.findUnique({ where: { id }, rejectOnNotFound: () => new UnauthorizedException() });
  }

  findOneByUsername(username: string): Promise<User> {
    return this.prismaService.user.findUnique({
      where: { username },
      rejectOnNotFound: () => new UnauthorizedException(),
    });
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return this.prismaService.user.update({ where: { id }, data: updateUserDto });
  }

  remove(id: number): Promise<User> {
    return this.prismaService.user.delete({ where: { id } });
  }
}
