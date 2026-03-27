import { Component, ElementRef, HostListener, inject, model, signal, viewChild, WritableSignal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { AuthService } from '../../core/services/auth-service';
import { NullValidationErrorResult, ValidationErrorResult } from '../../core/models/response';
import { AdminRegisterRequest, LoginRequest, RegisterRequest } from '../../api/generated/models';
import { ServerValidationErrors } from '../../shared/components/server-validation-error';
import { AppIfHasPermission } from '../../shared/directives/if-has-permission';

export type LoginMode = 'login' | 'register' | 'register-as-admin';

interface RegisterRequestWithConfirm extends RegisterRequest
{
    confirmPassword: string
}

interface RegisterAsAdminRequestWithConfirm extends AdminRegisterRequest
{
    confirmPassword: string,
    loginAsNewUser: boolean
}

@Component({
    selector: 'login-dialog',
    templateUrl: './login-dialog.html',
    styleUrl: './login-dialog.less',
    imports: [FormField, ServerValidationErrors, AppIfHasPermission]
})
export class LoginDialog
{
    private readonly authService: AuthService = inject(AuthService);

    public readonly loginMode = model<LoginMode>('login');

    protected readonly loginServerErrors: WritableSignal<ValidationErrorResult> = signal(NullValidationErrorResult);
    protected readonly registerServerErrors: WritableSignal<ValidationErrorResult> = signal(NullValidationErrorResult);
    protected readonly registerAsAdminServerErrors: WritableSignal<ValidationErrorResult> = signal(NullValidationErrorResult);

    private loginDialog = viewChild<ElementRef<HTMLDialogElement>>("loginDialog");

    private loginModel = signal<LoginRequest>({login: '', password: ''});
    protected loginForm = form(this.loginModel);

    private registerModel = signal<RegisterRequestWithConfirm>({login: '', password: '', confirmPassword: ''});
    protected registerForm = form(this.registerModel);

    private registerAsAdminModel = signal<RegisterAsAdminRequestWithConfirm>({login: '', password: '', confirmPassword: '', loginAsNewUser: false});
    protected registerAsAdminForm = form(this.registerAsAdminModel);


    public showDialog(mode: LoginMode = 'login')
    {
        this.loginMode.set(mode);
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
        let request: RegisterRequest = {login: this.registerAsAdminModel().login, password: this.registerAsAdminModel().password};
        this.authService.register(this.registerModel())
            .subscribe(() => {
                this.registerServerErrors.set(NullValidationErrorResult);
                this.closeDialog();
            }, error => {
                if (error instanceof ValidationErrorResult)
                    this.registerServerErrors.set(error);
            });
    }

    protected registerAsAdmin()
    {
        let request: AdminRegisterRequest = {login: this.registerAsAdminModel().login, password: this.registerAsAdminModel().password, roles: ['Admin']};
        this.authService.registerAsAdmin(request, this.registerAsAdminModel().loginAsNewUser)
            .subscribe(() => {
                this.registerAsAdminServerErrors.set(NullValidationErrorResult);
                this.closeDialog();
            }, error => {
                if (error instanceof ValidationErrorResult)
                    this.registerAsAdminServerErrors.set(error);
            });
    }
}
