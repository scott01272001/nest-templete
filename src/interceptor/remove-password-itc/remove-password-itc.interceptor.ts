import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Console } from 'console';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RemovePasswordItcInterceptor implements NestInterceptor {

  private removePassword(data: any): any {
    if (Array.isArray(data)) {
      return data.map(item => this.removePassword(item));
    }

    if (data && typeof data === 'object') {
      const { password, ...result } = data;
      return result;
    }



    return data;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => this.removePassword(data))
    );
  }

}
