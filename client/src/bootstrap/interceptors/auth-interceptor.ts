import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthStore } from '../../core/services/auth-store';

@Injectable()
export class AuthInterceptor implements HttpInterceptor
{
    private readonly authStore = inject(AuthStore);

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        if (this.authStore.status() == 'authorized')
        {
            const authToken = this.authStore.auth()?.token;

            const cloned = request.clone({
                setHeaders: { Authorization: `Bearer ${authToken}` }
            });
            return next.handle(cloned);
        }
        else
        {
            return next.handle(request);
        }
    }
}