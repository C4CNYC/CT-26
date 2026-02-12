import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { Role } from '../../modules/core/user/enums/role.enum'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'some_secret',
    })
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async validate(payload: {
    userId: string
    studentID: string
    email: string
    role: Role
  }): Promise<{ id: string; email: string; role: string; studentID: string }> {
    return {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
      studentID: payload.studentID,
    }
  }
}
