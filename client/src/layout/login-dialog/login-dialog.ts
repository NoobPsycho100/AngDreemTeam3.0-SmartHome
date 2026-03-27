import { Component, ElementRef, HostListener, inject, model, signal, viewChild, WritableSignal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { AuthService } from '../../core/services/auth-service';
import { NullValidationErrorResult, ValidationErrorResult } from '../../core/models/response';
import { ServerValidationErrors } from '../../shared/components/server-validation-error';
import { LoginRequest, RegisterRequest } from '../../api/generated';

export type LoginMode = 'login' | 'register';

interface RegisterRequestWithConfirm extends RegisterRequest
{
    confirmPassword: string
}

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

    private registerModel = signal<RegisterRequestWithConfirm>({login: '', password: '', confirmPassword: ''});
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
            .subscribe(() => {
                this.loginServerErrors.set(NullValidationErrorResult);
                this.closeDialog();
            }, error => {
                if (error instanceof ValidationErrorResult)
                    this.loginServerErrors.set(error);
            });
    }

    protected register()
    {
        this.authService.register(this.registerModel())
            .subscribe(() => {
                this.registerServerErrors.set(NullValidationErrorResult);
                this.closeDialog();
            }, error => {
                if (error instanceof ValidationErrorResult)
                    this.registerServerErrors.set(error);
            });
    }
}
