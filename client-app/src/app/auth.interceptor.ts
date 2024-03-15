import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { CognitoService } from './cognito.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private cognitoService: CognitoService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Check if the current request is a token refresh request
    const isTokenRefreshRequest = req.url.includes('your-refresh-token-endpoint');
  
    // Clone the original request with the Authorization header
    const authToken = localStorage.getItem('id_token');
    const authReq = req.clone({
      setHeaders: authToken ? { Authorization: authToken } : {},
    });
  
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
          return throwError(error);
      })
    )};

  private handleTokenRefresh(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Promise<HttpEvent<any> | undefined> {
    return this.cognitoService.refreshToken().then(
      (newToken: string) => {
        // Save the new token
        localStorage.setItem('id_token', newToken);

        // Clone the original request with the new token
        const newReq = req.clone({
          setHeaders: {
            Authorization: newToken,
          },
        });

        // Retry the request with the new token
        return next.handle(newReq).toPromise();
      },
      (err: any) => {
        // Handle error when refreshing the token
        console.error('Error during token refresh:', err);
        return Promise.reject(err);
      }
    ).catch((error) => {
      console.error('Error during request retry:', error);
      return undefined;
    });
  }
}
