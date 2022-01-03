import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserAccount } from './auth.models';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    private jwt: JwtHelperService,
  ) {}

  login(user: UserAccount): Observable<UserAccount> {
    return this.http.post<UserAccount>(`${this.baseUrl}/auth/login`, user);
  }

  register(user: UserAccount): Observable<UserAccount> {
    return this.http.post<UserAccount>(`${this.baseUrl}/auth/register`, user);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token') || '';
    return !this.jwt.isTokenExpired(token);
  }
}
