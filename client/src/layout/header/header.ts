import { Component, computed, inject, viewChild } from '@angular/core';
import { AuthService } from '../../core/services/auth-service';
import { LoginDialog } from '../login-dialog/login-dialog';

@Component({
    selector: 'app-header',
    imports: [LoginDialog],
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

    protected showLoginModal()
    {
        this.loginDialog()?.showDialog();
    }
}