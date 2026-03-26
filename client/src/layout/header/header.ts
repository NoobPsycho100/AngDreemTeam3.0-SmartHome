import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { AuthService } from '../../core/services/auth-service';
import { ValidationErrorResult, NullValidationErrorResult } from '../../core/models/response';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.less'
})
export class Header
{
  private readonly authService: AuthService = inject(AuthService);

  protected readonly isAuthorized = computed(() => this.authService.currentAuthData().isAuthorized);
  protected readonly currentUserName = computed(() => this.authService.currentAuthData().login);

  private readonly _serverErrors: WritableSignal<ValidationErrorResult> = signal(NullValidationErrorResult);
  protected readonly serverErrors = computed(() => JSON.stringify(this._serverErrors.asReadonly()()));

  protected login(login: string, password: string)
  {
    this.authService.login({login: login, password: password})
      .subscribe(x => {
        if (x instanceof ValidationErrorResult)
          this._serverErrors.set(x);
        else
          this._serverErrors.set(NullValidationErrorResult);
      });
  }

  protected logout()
  {
    this.authService.logout();
  }
}
