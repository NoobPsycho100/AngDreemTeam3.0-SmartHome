import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, filter, map, of, throwError } from 'rxjs';
import { ValidationErrorResult } from '../../core/models/response';

// Transforms 400 server validation error response 
//   into 200 OK response typed by ValidationErrorResult.
@Injectable()
export class ServerValidationInterceptor implements HttpInterceptor
{
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        return next.handle(request)
            .pipe(catchError((error: HttpErrorResponse) => {
                if (error.status != 400)
                    return throwError(error);

                if (error.error.type != "https://tools.ietf.org/html/rfc9110#section-15.5.1")
                    return throwError(error);

                let validationErrors: {key: string, error: string}[] = [];

                for (let key in error.error.errors)
                {
                    let keyErrors = (error.error.errors as any)[key];
                    if (Array.isArray(keyErrors))
                        keyErrors.forEach(keyError => validationErrors.push({key, error: keyError.toString()}));
                    else
                        validationErrors.push({key, error: keyErrors.toString()});
                }

                let validationResult = new ValidationErrorResult(validationErrors);


                return of(new HttpResponse({ status: 200, body: validationResult }));
            }));
    }
}