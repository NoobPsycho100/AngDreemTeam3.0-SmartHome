import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, Observable } from 'rxjs';
import { LoginRequest } from '../models/requests/login-request';
import { OkResult, Response, ValidationErrorResult } from '../models/response';
import { AuthData, Unauthorized } from '../domain/auth';

@Injectable({providedIn: 'root'})
export class AuthService
{
    private http = inject(HttpClient);
    private router = inject(Router);

    private readonly localAuthKey = 'local-auth';
    private readonly _currentAuthData: WritableSignal<AuthData> = signal(this.getCurrentAuthFromToken(localStorage.getItem(this.localAuthKey)));
    public readonly currentAuthData: Signal<AuthData> = this._currentAuthData.asReadonly();
    public readonly currentAuthChange: Observable<AuthData> = toObservable(this.currentAuthData);
    // TODO: request to server for user data (not auth data - i.e. photo, real name or whatever)

    private setCurrentUser(token: string)
    {
        let user = this.getCurrentAuthFromToken(token);
        this._currentAuthData.set(user);

        localStorage.setItem(this.localAuthKey, token);
        
        // Angular will not re-check route guards
        this.router.navigateByUrl('');
    }

    private getCurrentAuthFromToken(token: string | null): AuthData
    {
        if (!token)
            return Unauthorized;

        let tokenData = atob(token.split('.')[1]);
        let userData = JSON.parse(tokenData);

        return new AuthData(userData.Login, token, userData.Roles, userData.Permissions);
    }

    public login(login: LoginRequest): Observable<Response<OkResult>>
    {
        // TODO: move https://localhost:7086 to settings
        return this.http.post<Response<OkResult>>('https://localhost:7086/api/auth/login', login, { observe: 'response' })
            .pipe(map(response => {
                if (response.body instanceof ValidationErrorResult)
                    return response.body;

                var token = response.headers.get('x-auth-token');
                if (token == null)
                    return new ValidationErrorResult([{key: 'login', error: 'unspecified error'}]);

                this.setCurrentUser(token);
                return new OkResult();
            }));
    }

    public logout()
    {
        this._currentAuthData.set(Unauthorized);
        
        // Angular will not re-check route guards
        this.router.navigateByUrl('');
    }
};