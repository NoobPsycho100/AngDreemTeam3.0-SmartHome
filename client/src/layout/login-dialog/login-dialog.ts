import { Component, computed, ElementRef, HostListener, inject, signal, viewChild, ViewChild, WritableSignal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { LoginRequest } from '../../core/models/requests/login-request';
import { AuthService } from '../../core/services/auth-service';
import { NullValidationErrorResult, ValidationErrorResult } from '../../core/models/response';
import { ServerValidationErrors } from '../../shared/components/server-validation-error';

@Component({
    selector: 'login-dialog',
    templateUrl: './login-dialog.html',
    styleUrl: './login-dialog.less',
    imports: [FormField, ServerValidationErrors]
})
export class LoginDialog
{
    private readonly authService: AuthService = inject(AuthService);

    protected readonly serverErrors: WritableSignal<ValidationErrorResult> = signal(NullValidationErrorResult);

    private loginDialog = viewChild<ElementRef<HTMLDialogElement>>("loginDialog");
    private loginModel = signal<LoginRequest>({
        login: '',
        password: '',
    });

    protected loginForm = form(this.loginModel);

    public showDialog()
    {
        this.loginDialog()?.nativeElement.showModal();
    }

    public closeDialog()
    {
        this.loginDialog()?.nativeElement.close();
    }

    @HostListener("window:keydown.escape") 
    protected onClick()
    {
        this.closeDialog();
    }

    protected login()
    {
        this.authService.login(this.loginModel())
            .subscribe(x => {
                if (x instanceof ValidationErrorResult)
                    this.serverErrors.set(x);
                else
                {
                    this.serverErrors.set(NullValidationErrorResult);
                    this.closeDialog();
                }
            });
    }
}
