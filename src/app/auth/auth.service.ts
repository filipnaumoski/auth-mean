import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { AuthData, AuthDataLogin } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  getToken() {
    return this.token;
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
        console.log('res', res);
      });
  }

  login(email: string, password: string) {
    const authDataLogin: AuthDataLogin = {
      email: email,
      password: password
    };
    this.http
      .post<{ token: string }>(
        'http://localhost:3000/api/user/login',
        authDataLogin
      )
      .subscribe(res => {
        const token = res.token;
        this.token = token;
        this.authStatusListener.next(true);
      });
  }
}
