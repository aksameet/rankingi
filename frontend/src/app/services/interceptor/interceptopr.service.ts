// src/app/services/http-interceptor.service.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = 'YOUR_SECRET_TOKEN'; // Replace with your secret token

    const clonedRequest = request.clone({
      setHeaders: {
        'X-Custom-Auth': token,
      },
    });

    return next.handle(clonedRequest);
  }
}
