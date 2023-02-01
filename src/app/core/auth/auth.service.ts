import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import { appConfig } from '../config/app.config';
import { EcommifyApiResponse } from '../api/api.types';

import { AuthUtils } from './auth.utils';
import { User } from '../user/user.types';

@Injectable()
export class AuthService {
  private _config = appConfig;
  private _authenticated: boolean = false;
  /**
   * Constructor
   */
  constructor(
    private _httpClient: HttpClient,
    private _userService: UserService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter for access token
   */
  set accessToken(token: string) {
    token && localStorage.setItem('accessToken', token);
  }

  get accessToken(): string {
    return localStorage.getItem('accessToken') ?? '';
  }

  /**
   * Setter & getter for token expiration date
   */
  set tokenExpirationDate(expirationDate: number) {
    expirationDate &&
      localStorage.setItem('tokenExpirationDate', expirationDate.toString());
  }

  get tokenExpirationDate(): number {
    return +localStorage.getItem('tokenExpirationDate') ?? 0;
  }
  // setter & getter for role
  set role(role: string) {
    role && localStorage.setItem('role', role);
  }
  get role(): string {
    return localStorage.getItem('role') ?? '';
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Forgot password
   *
   * @param email
   */
  forgotPassword(email: string): Observable<any> {
    return this._httpClient.post('api/auth/forgot-password', email);
  }

  /**
   * Reset password
   *
   * @param password
   */
  resetPassword(password: string): Observable<any> {
    return this._httpClient.post('api/auth/reset-password', password);
  }

  /**
   * Sign in
   *
   * @param credentials
   */
  signIn(credentials: { email: string; password: string }): Observable<any> {
    // Throw error, if the user is already logged in
    if (this._authenticated) {
      return throwError('User is already logged in.');
    }

    const api = this._config?.apiConfig?.baseUrl;
    const formData = new FormData();
    formData.append('email', credentials?.email);
    formData.append('password', credentials?.password);

    return this._httpClient
      .post<EcommifyApiResponse<User>>(`${api}/auth/login`, formData)
      .pipe(
        switchMap((response: EcommifyApiResponse<User>) => {
          const { result } = response;
          if (result) {
            // Store the access token in the local storage
            this.accessToken = result?.access_token;
            this.tokenExpirationDate = result?.expire_at;

            // store the role in the local storage
            this.role = result?.role;
            // // Set the authenticated flag to true
            // this._authenticated = true;
            // Store the user on the user service
            this._userService.user = result;
          }
          // Return a new observable with the response
          return of(response);
        })
      );
  }

  /**
   * Sign in using the access token
   */
  signInUsingToken(): Observable<any> {
    // Sign in using the token
    return this._httpClient
      .post('api/auth/sign-in-with-token', {
        accessToken: this.accessToken,
      })
      .pipe(
        catchError(() =>
          // Return false
          of(false)
        ),
        switchMap((response: any) => {
          // Replace the access token with the new one if it's available on
          // the response object.
          //
          // This is an added optional step for better security. Once you sign
          // in using the token, you should generate a new one on the server
          // side and attach it to the response object. Then the following
          // piece of code can replace the token with the refreshed one.
          if (response.accessToken) {
            this.accessToken = response.accessToken;
          }

          // Set the authenticated flag to true
          this._authenticated = true;

          // Store the user on the user service
          this._userService.user = response.user;

          // Return true
          return of(true);
        })
      );
  }

  /**
   * Sign out
   */
  signOut(): Observable<any> {
    // Remove the access token from the local storage
    localStorage.removeItem('accessToken');
    //Remove the role from the local storage
    localStorage.removeItem('role');
    //Remove the company Id from local storage
    localStorage.removeItem('companyId');
    //Remove the company name from local storage
    localStorage.removeItem('companyName');
    //Remove the impersonate from local storage
    localStorage.removeItem('impersonate');
    // Set the authenticated flag to false
    this._authenticated = false;

    // Return the observable
    return of(true);
  }

  /**
   * Sign up
   *
   * @param user
   */
  signUp(user: {
    name: string;
    email: string;
    password: string;
    company: string;
  }): Observable<any> {
    return this._httpClient.post('api/auth/sign-up', user);
  }

  /**
   * Unlock session
   *
   * @param credentials
   */
  unlockSession(credentials: {
    email: string;
    password: string;
  }): Observable<any> {
    return this._httpClient.post('api/auth/unlock-session', credentials);
  }

  /**
   * Check the authentication status
   */
  check(): Observable<boolean> {
    // Check if the user is logged in

    if (this._authenticated) {
      return of(true);
    }

    // Check the access token availability
    if (!this.accessToken) {
      return of(false);
    }

    // Check the access token expire date
    if (AuthUtils.isTokenExpired(this.accessToken, this.tokenExpirationDate)) {
      return of(false);
    }

    // If the access token exists and it didn't expire, sign in using it
    return this.signInUsingToken();
  }
}
