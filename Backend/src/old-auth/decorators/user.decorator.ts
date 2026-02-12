import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { decode, JwtPayload } from 'jsonwebtoken'

export const AuthUser = createParamDecorator(
  (_data, context: ExecutionContext) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const token = request.headers.authorization.split(' ')[1]
    if (!token) {
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const payload = decode(token) as JwtPayload
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const userId = payload.userId

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return userId
  },
)
