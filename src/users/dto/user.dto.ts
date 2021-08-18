import { Role } from '@prisma/client';

export class UserDto {
  id: number;
  username: string;
  role: Role;
}
