import { IsJWT } from 'class-validator';

export class JwtDto {
  @IsJWT()
  access_token: string;
}
