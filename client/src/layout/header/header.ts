import { Component, computed, inject, viewChild } from '@angular/core';
import { AuthStore, AuthService } from '../../core/services/services';
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
    private readonly authStore = inject(AuthStore);

    protected readonly isAuthorized = computed(() => this.authStore.status() == 'authorized');
    protected readonly currentUserName = computed(() => this.authStore.auth()?.login);

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