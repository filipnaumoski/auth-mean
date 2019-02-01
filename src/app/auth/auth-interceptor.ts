import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from '@angular/common/http';
import { Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  refreshTokenSubject = new Subject();
  tokenRefreshed$ = this.refreshTokenSubject.asObservable();

  constructor(private authToken: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authToken.getToken();
    const refreshToken = this.authToken.getRefreshToken();
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    });
    return next.handle(authRequest);
  }
}
