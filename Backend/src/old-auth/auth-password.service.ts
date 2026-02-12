import * as bcrypt from 'bcrypt'

import { InvalidPasswordException } from './exceptions/invalid-password.exception'

export class AuthPasswordsService {
  private static SALT_ROUNDS = 10

  async createHashedPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(AuthPasswordsService.SALT_ROUNDS)
    return await bcrypt.hash(password, salt)
  }

  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword)
  }

  async getHashedPassword(password: string): Promise<string> {
    const isPasswordValid = this.validatePassword(password)
    if (!isPasswordValid) throw new InvalidPasswordException()
    return await this.createHashedPassword(password)
  }

  validatePassword(password: string): boolean {
    return password.length >= 8
  }
}
