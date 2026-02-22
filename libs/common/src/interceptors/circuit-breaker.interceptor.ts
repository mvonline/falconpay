import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

enum CircuitState {
    CLOSED,
    OPEN,
    HALF_OPEN,
}

@Injectable()
export class CircuitBreakerInterceptor implements NestInterceptor {
    private state = CircuitState.CLOSED;
    private failureCount = 0;
    private lastFailureTime = 0;
    private readonly failureThreshold = 5;
    private readonly resetTimeout = 30000; // 30 seconds

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        if (this.state === CircuitState.OPEN) {
            if (Date.now() - this.lastFailureTime > this.resetTimeout) {
                this.state = CircuitState.HALF_OPEN;
            } else {
                return throwError(
                    () => new HttpException('Service temporarily unavailable (Circuit Open)', HttpStatus.SERVICE_UNAVAILABLE),
                );
            }
        }

        return next.handle().pipe(
            tap(() => {
                if (this.state === CircuitState.HALF_OPEN) {
                    this.state = CircuitState.CLOSED;
                    this.failureCount = 0;
                }
            }),
            catchError((err) => {
                this.failureCount++;
                this.lastFailureTime = Date.now();

                if (this.failureCount >= this.failureThreshold) {
                    this.state = CircuitState.OPEN;
                }

                return throwError(() => err);
            }),
        );
    }
}
