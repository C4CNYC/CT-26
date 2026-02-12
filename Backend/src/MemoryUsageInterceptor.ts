import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class MemoryUsageInterceptor implements NestInterceptor {
  private readonly logger = new Logger(MemoryUsageInterceptor.name)

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { method, path } = request
    const startMemory = process.memoryUsage().heapUsed
    const startTime = Date.now()
    const logMemoryAndTime = (errorMessage = '') => {
      const endMemory = process.memoryUsage().heapUsed
      const endTime = Date.now()
      const memoryDiff = (endMemory - startMemory) / 1024 / 1024
      const executionTime = endTime - startTime

      if (executionTime > 300 || memoryDiff > 10) {
        const logMessage = `
        MemHere: ${memoryDiff.toFixed(2)} MB
        MemAll: ${(endMemory / 1024 / 1024).toFixed(0)} MB
        Exec: ${executionTime} ms
        ${method} ${path} ${/*JSON.stringify(errorMessage)*/''}
        `
        this.logger.error(logMessage)
      }
    }

    return next.handle().pipe(
      tap({
        next: logMemoryAndTime,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error: (error) => logMemoryAndTime(error.message),
      }),
    )
  }
}
