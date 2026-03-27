import { Component, computed, ElementRef, HostListener, inject, input, model, signal, viewChild, ViewChild, WritableSignal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { LoginRequest } from '../../core/models/requests/login-request';
import { AuthService } from '../../core/services/auth-service';
import { NullValidationErrorResult, ValidationErrorResult } from '../../core/models/response';
import { ServerValidationErrors } from '../../shared/components/server-validation-error';
import { RegisterRequest } from '../../core/models/requests/register-request';

export type LoginMode = 'login' | 'register';

@Component({
    selector: 'login-dialog',
    templateUrl: './login-dialog.html',
    styleUrl: './login-dialog.less',
    imports: [FormField, ServerValidationErrors]
})
export class LoginDialog
{
    private readonly authService: AuthService = inject(AuthService);

    public readonly loginMode = model<LoginMode>('login');

    protected readonly loginServerErrors: WritableSignal<ValidationErrorResult> = signal(NullValidationErrorResult);
    protected readonly registerServerErrors: WritableSignal<ValidationErrorResult> = signal(NullValidationErrorResult);

    private loginDialog = viewChild<ElementRef<HTMLDialogElement>>("loginDialog");

    private loginModel = signal<LoginRequest>({login: '', password: ''});
    protected loginForm = form(this.loginModel);

    private registerModel = signal<RegisterRequest>({login: '', password: '', confirmPassword: ''});
    protected registerForm = form(this.registerModel);

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
                    this.loginServerErrors.set(x);
                else
                {
                    this.loginServerErrors.set(NullValidationErrorResult);
                    this.closeDialog();
                }
            });
    }

    protected register()
    {
        this.authService.register(this.registerModel())
            .subscribe(x => {
                if (x instanceof ValidationErrorResult)
                    this.registerServerErrors.set(x);
                else
                {
                    this.registerServerErrors.set(NullValidationErrorResult);
                    this.closeDialog();
                }
            });
    }
}
