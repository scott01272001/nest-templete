import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RemovePasswordItcInterceptor implements NestInterceptor {
  private removePassword(data: any): any {
    // Handle null/undefined
    if (data === null || data === undefined) {
      return data;
    }

    // Handle arrays
    if (Array.isArray(data)) {
      return data.map((item) => this.removePassword(item));
    }

    // Handle objects
    if (typeof data === 'object') {
      const result = {};

      for (const [key, value] of Object.entries(data)) {
        // Skip password fields
        if (key === 'password') {
          continue;
        }

        if (value === null) {
          continue;
        }

        if (key === '_id' && typeof value === 'object' && value.toString) {
          result[key] = value.toString();
          continue;
        }

        if (value instanceof Date) {
          result[key] = value.toISOString();
          continue;
        }

        // Recursively process nested objects/arrays
        result[key] = this.removePassword(value);
      }

      return result;
    }

    // Return primitive values as-is
    return data;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.removePassword(data)));
  }
}
