import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor
{
    private readonly authService: AuthService = inject(AuthService);

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        if (this.authService.currentAuthData().isAuthorized)
        {
            const authToken = this.authService.currentAuthData().token;

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