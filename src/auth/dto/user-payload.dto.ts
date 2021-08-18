import { Role } from '@prisma/client';

export class UserPayloadDto {
  role: Role;
  sub: number;
  username: string;
}
