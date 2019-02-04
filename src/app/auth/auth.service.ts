import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData, AuthDataLogin } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated = false;
  private tokenTimer: any;
  private token: string;
  private refreshToken: string;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getRefreshToken() {
    return this.refreshToken;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(
    first_name: string,
    last_name: string,
    email: string,
    password: string
  ) {
    const authData: AuthData = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password
    };
    this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe(res => {
      });
  }

  login(email: string, password: string) {
    const authDataLogin: AuthDataLogin = {
      email: email,
      password: password
    };
    this.http
      .post<{ token: string; expiresIn: number; userId: string; refreshToken: string }>(
        'http://localhost:3000/api/user/login',
        authDataLogin
      )
      .subscribe(res => {
        const token = res.token;
        const refreshToken = res.refreshToken;
        this.token = token;
        this.refreshToken = refreshToken;
        if (token) {
          const expiresInDuration = res.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = res.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          this.saveAuthData(token, expirationDate, this.userId, refreshToken);
          this.router.navigate(['/']);
        }
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.refreshToken = authInformation.refreshToken;
      this.userId = authInformation.userId;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.refreshToken = null;
    this.isAuthenticated = false;
    this.userId = null;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, refreshToken: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      refreshToken: refreshToken,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }
}
