import { HttpException, HttpStatus } from '@nestjs/common'

export class InvalidPasswordException extends HttpException {
  constructor() {
    super('password is week', HttpStatus.BAD_REQUEST)
  }
}
