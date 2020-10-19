import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

export class ServerErrorInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      // Si sucede un error de lado del servidor, reintentamos 1 vez
      // retry(1),
      catchError((error: HttpErrorResponse) => {
        // Si es error 401 (No autorizado)
        if (error.status === 401) {
          // refrescamos el token
        } else {
          return throwError(error);
        }
      })
    );
  }
}
