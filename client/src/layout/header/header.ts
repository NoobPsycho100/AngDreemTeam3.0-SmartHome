import { Component, computed, inject, viewChild } from '@angular/core';
import { AuthService } from '../../core/services/auth-service';
import { LoginDialog, LoginMode } from '../login-dialog/login-dialog';
import { AppIfHasPermission } from '../../shared/directives/if-has-permission';

@Component({
    selector: 'app-header',
    imports: [LoginDialog, AppIfHasPermission],
    templateUrl: './header.html',
    styleUrl: './header.less'
})
export class Header
{
    private readonly authService: AuthService = inject(AuthService);

    protected readonly isAuthorized = computed(() => this.authService.currentAuthData().isAuthorized);
    protected readonly currentUserName = computed(() => this.authService.currentAuthData().login);

    private loginDialog = viewChild<LoginDialog>("loginDialog");

    protected logout()
    {
        this.authService.logout();
    }

    protected showLoginModal(mode: LoginMode)
    {
        this.loginDialog()?.showDialog(mode);
    }
}