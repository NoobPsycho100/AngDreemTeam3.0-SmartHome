import { Component, ElementRef, HostListener, inject, model, signal, viewChild, WritableSignal } from '@angular/core';
import { FieldState, form, FormField, minLength, required, validate } from '@angular/forms/signals';
import { AuthService } from '../../core/services/auth-service';
import { NullValidationErrorResult, ValidationErrorResult } from '../../core/models/response';
import { AdminRegisterRequest, LoginRequest, RegisterRequest } from '../../api/generated/models';
import { ServerValidationErrors } from '../../shared/components/server-validation-error';
import { AppIfHasPermission } from '../../shared/directives/if-has-permission';
import { ClientValidationErrors } from '../../shared/components/client-validation-error';

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
    imports: [FormField, ServerValidationErrors, ClientValidationErrors, AppIfHasPermission]
})
export class LoginDialog
{
    private readonly authService: AuthService = inject(AuthService);

    public readonly loginMode = model<LoginMode>('login');

    private loginDialog = viewChild<ElementRef<HTMLDialogElement>>("loginDialog");

    // #region login

    protected readonly loginServerErrors: WritableSignal<ValidationErrorResult> = signal(NullValidationErrorResult);

    private loginModel = signal<LoginRequest>({login: '', password: ''});
    protected loginForm = form(this.loginModel, (schema) => {
        required(schema.login, {message: 'Login is required'});
        required(schema.password, {message: 'Password is required'});
    });

    protected login()
    {
        if (!this.loginForm().valid())
            return;

        this.authService.login(this.loginModel())
            .subscribe(() => {
                this.loginServerErrors.set(NullValidationErrorResult);
                this.closeDialog();
            }, error => {
                if (error instanceof ValidationErrorResult)
                    this.loginServerErrors.set(error);
            });
    }

    // #endregion login

    // #region register

    protected readonly registerServerErrors: WritableSignal<ValidationErrorResult> = signal(NullValidationErrorResult);

    private registerModel = signal<RegisterRequestWithConfirm>({login: '', password: '', confirmPassword: ''});
    protected registerForm = form(this.registerModel, (schema) => {
        required(schema.login, {message: 'Login is required'});
        required(schema.password, {message: 'Password is required'});
        minLength(schema.password, 5, {message: 'Password should be longer than 5 symbols'});
        validate(schema.confirmPassword, ({value, valueOf}) => {
            const confirmPassword = value();
            const password = valueOf(schema.password);
            if (confirmPassword !== password)
                return {
                    kind: 'passwordMismatch',
                    message: 'Passwords should match',
                };
            return null;
        });
    });

    protected register()
    {
        if (!this.registerForm().valid())
            return;

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

    // #endregion register

    // #region register as admin

    protected readonly registerAsAdminServerErrors: WritableSignal<ValidationErrorResult> = signal(NullValidationErrorResult);

    private registerAsAdminModel = signal<RegisterAsAdminRequestWithConfirm>({login: '', password: '', confirmPassword: '', loginAsNewUser: false});
    protected registerAsAdminForm = form(this.registerAsAdminModel, (schema) => {
        required(schema.login, {message: 'Login is required'});
        required(schema.password, {message: 'Password is required'});
        minLength(schema.password, 5, {message: 'Password should be longer than 5 symbols'});
        validate(schema.confirmPassword, ({value, valueOf}) => {
            const confirmPassword = value();
            const password = valueOf(schema.password);
            if (confirmPassword !== password)
                return {
                    kind: 'passwordMismatch',
                    message: 'Passwords should match',
                };
            return null;
        });
    });

    protected registerAsAdmin()
    {
        if (!this.registerAsAdminForm().valid())
            return;

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

    // #endregion register as admin

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
}
