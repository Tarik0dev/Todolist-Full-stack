import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  RegisterRequestInterface,
  SignInRequestInterface,
} from '../models/request/authenticationRequest.interface';
import {
  SignInResponseInterface,
  RegisterResponseInterface,
} from '../models/response/authenticationResponse.interface';
import { ForgotPasswordRequest } from '../models/request/forgotPasswordRequest.interface';
import {
  ForgotPasswordResponse,
  ResetPasswordResponse,
} from '../models/response/forgotPasswordResponse.interface';
import { ResetPasswordRequestInterface } from '../models/request/forgotPasswordRequest.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000';

  register(user: RegisterRequestInterface): Observable<RegisterResponseInterface> {
    return this.http.post<RegisterResponseInterface>(this.apiUrl + '/auth/register', user);
  }
  signIn(user: SignInRequestInterface): Observable<SignInResponseInterface> {
    return this.http.post<SignInResponseInterface>(this.apiUrl + '/auth/login', user);
  }

  forgotPassword(email: ForgotPasswordRequest): Observable<ForgotPasswordResponse> {
    return this.http.post<ForgotPasswordResponse>(this.apiUrl + '/password/forgot-password', email);
  }

  resetPassword(data: ResetPasswordRequestInterface): Observable<ResetPasswordResponse> {
    return this.http.post<ResetPasswordResponse>(this.apiUrl + '/password/reset-password', data);
  }
}
