import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LoginRequest } from '../models/requests/login-request';
import { OkResult, Response, ValidationErrorResult } from '../models/response';
import { AuthData, Unauthorized } from '../models/domain/auth';

@Injectable({providedIn: 'root'})
export class AuthService
{
    private http = inject(HttpClient);

    private readonly _currentAuthData: WritableSignal<AuthData> = signal(Unauthorized);
    public readonly currentAuthData: Signal<AuthData> = this._currentAuthData.asReadonly();

    private setCurrentUser(token: string)
    {
        let tokenData = atob(token.split('.')[1]);
        let userData = JSON.parse(tokenData);

        let user = new AuthData(userData.Login, token, userData.Roles, userData.Permissions);

        this._currentAuthData.set(user);
    }

    public login(login: LoginRequest): Observable<Response<OkResult>>
    {
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
    }
};