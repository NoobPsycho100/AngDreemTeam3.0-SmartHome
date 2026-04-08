import { AuthService as ApiAuthService } from '../../api/generated/services';
import { AdminRegisterRequest, LoginRequest, RegisterRequest } from '../../api/generated/models';
import { inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, Observable, throwError, timer } from 'rxjs';
import { OkResult, ValidationErrorResult } from '../models/response';
import { AuthData, Unauthorized } from '../domain/auth';

@Injectable({providedIn: 'root'})
export class AuthService
{
    private apiAuthService = inject(ApiAuthService);
    private router = inject(Router);

    private readonly localAuthKey = 'local-auth';
    private readonly _currentAuthData: WritableSignal<AuthData> = signal(this.getCurrentAuthFromToken(localStorage.getItem(this.localAuthKey)));
    public readonly currentAuthData: Signal<AuthData> = this._currentAuthData.asReadonly();
    public readonly currentAuthChange: Observable<AuthData> = toObservable(this.currentAuthData);

    private setCurrentUser(token: string)
    {
        let user = this.getCurrentAuthFromToken(token);
        this._currentAuthData.set(user);

        localStorage.setItem(this.localAuthKey, token);
        
        this.router.navigateByUrl('');
        if (user != Unauthorized)
        {
            timer(10).subscribe(() => {
                this.router.navigateByUrl('dashboard');
            });
        }
    }

    private getCurrentAuthFromToken(token: string | null): AuthData
    {
        if (!token)
            return Unauthorized;

        let tokenData = atob(token.split('.')[1]);
        let userData = JSON.parse(tokenData);

        return new AuthData(userData.Login, token, userData.Roles, userData.Permissions);
    }

    public login(model: LoginRequest): Observable<OkResult>
    {
        return this.apiAuthService.apiAuthLoginPost(model, 'response')
            .pipe(map(response => {
                let token = response.headers.get('x-auth-token');
                if (token == null)
                    return throwError(new ValidationErrorResult([{key: 'login', error: 'unspecified error'}]));

                this.setCurrentUser(token);
                return new OkResult();
            }));
    }

    public register(model: RegisterRequest): Observable<OkResult>
    {
        return this.apiAuthService.apiAuthRegisterPost(model, 'response')
            .pipe(map(response => {
                let token = response.headers.get('x-auth-token');
                if (token == null)
                    return throwError(new ValidationErrorResult([{key: 'login', error: 'unspecified error'}]));

                this.setCurrentUser(token);
                return new OkResult();
            }));
    }

    public registerAsAdmin(model: AdminRegisterRequest, loginAsNewUser: boolean): Observable<OkResult>
    {
        return this.apiAuthService.apiAuthRegisterAdminPost(model, 'response')
            .pipe(map(response => {
                let token = response.headers.get('x-auth-token');
                if (token == null)
                    return throwError(new ValidationErrorResult([{key: 'login', error: 'unspecified error'}]));

                if (loginAsNewUser)
                    this.setCurrentUser(token);
                return new OkResult();
            }));
    }

    public refreshToken(): Observable<OkResult>
    {
        return this.apiAuthService.apiAuthRefreshPost('response')
            .pipe(map(response => {
                let token = response.headers.get('x-auth-token');
                if (token == null)
                    return throwError(new ValidationErrorResult([{key: 'login', error: 'unspecified error'}]));

                this.setCurrentUser(token);
                return new OkResult();
            }));
    }

    public checkIsLoginFree(login: string): Observable<boolean>
    {
        return this.apiAuthService.apiAuthCheckLoginGet(login, 'body');
    }

    public logout()
    {
        this._currentAuthData.set(Unauthorized);
        localStorage.removeItem(this.localAuthKey);
        
        this.router.navigateByUrl('');
    }
};