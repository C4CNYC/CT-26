import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { all } from 'axios'
import { Observable } from 'rxjs'

@Injectable()
export class RolesAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const allowedRoles =
      this.reflector.get<string[]>('roles', context.getHandler()) ||
      this.reflector.get<string[]>('roles', context.getClass())
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const userRole = request.user?.role
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (!allowedRoles || allowedRoles.length === 0) {
      // If no roles are set, either restrict access or allow all depending on your application's default behavior
      throw new ForbiddenException(
        'Access denied: No roles defined for this route.',
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (allowedRoles.includes(userRole)) {
      return true
    }
    console.log(allowedRoles, userRole);
    throw new ForbiddenException(
      'You do not have permission to access this resource.',
    )
  }
}
