import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthStore } from '../../core/services/services';

@Injectable()
export class AuthInterceptor implements HttpInterceptor
{
    private readonly authStore = inject(AuthStore);

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        const authToken = this.authStore.auth()?.token;
        if (!!authToken)
        {
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