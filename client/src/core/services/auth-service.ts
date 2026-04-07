import { AuthService as ApiAuthService } from '../../api/generated/services';
import { AdminRegisterRequest, LoginRequest, RegisterRequest } from '../../api/generated/models';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { OkResult, ValidationErrorResult } from '../models/response';
import { AuthStore } from './auth-store';
import { HttpResponse } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class AuthService
{
    private readonly apiAuthService = inject(ApiAuthService);
    private readonly router = inject(Router);
    private readonly authStore = inject(AuthStore);

    public constructor()
    {
        this.authStore.changes$.subscribe(
            state => { 
                if (!state.initState)
                    this.router.navigateByUrl(state.status == 'authorized' ? 'dashboard' : "");
            }
        );
        
        //this.authStore.changes$.subscribe(
        //    state => { console.log(state); }
        //);
    }

    public checkIsLoginFree(login: string): Observable<boolean>
    {
        return this.apiAuthService.apiAuthCheckLoginGet(login, 'body');
    }

    public login(model: LoginRequest): Observable<OkResult>
    {
        return this.handleAuthTokenResponse(
            this.apiAuthService.apiAuthLoginPost(model, 'response'),
            true);
    }

    public register(model: RegisterRequest): Observable<OkResult>
    {
        return this.handleAuthTokenResponse(
            this.apiAuthService.apiAuthRegisterPost(model, 'response'),
            true);
    }

    public registerAsAdmin(model: AdminRegisterRequest, loginAsNewUser: boolean): Observable<OkResult>
    {
        return this.handleAuthTokenResponse(
            this.apiAuthService.apiAuthRegisterAdminPost(model, 'response'),
            loginAsNewUser);
    }

    public refreshToken(): Observable<OkResult>
    {
        return this.handleAuthTokenResponse(
            this.apiAuthService.apiAuthRefreshPost('response'),
            true);
    }

    public logout()
    {
        this.authStore.logout();
    }

    private handleAuthTokenResponse(authResponse$: Observable<HttpResponse<any>>, loginAsNewUser: boolean): Observable<OkResult>
    {
        if (loginAsNewUser)
            this.authStore.setLoading();

        return authResponse$.pipe(
                map(response =>
                {
                    let token = response.headers.get('x-auth-token');
                    if (token == null)
                    {
                        if (loginAsNewUser)
                            this.authStore.setError();
                        return throwError(new ValidationErrorResult([{key: 'login', error: 'unspecified error'}]));
                    }

                    if (loginAsNewUser)
                        this.authStore.setAuthToken(token);

                    return new OkResult();
                }),
                catchError(error =>
                {
                    if (loginAsNewUser)
                        this.authStore.setError();

                    return throwError(error);
                })
        );
    }
};