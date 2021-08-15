declare module 'express' {
  interface Request {
    user: UserDto;
  }
}
