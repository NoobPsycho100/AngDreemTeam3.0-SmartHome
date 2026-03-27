import { Component, Signal, signal, WritableSignal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppIfHasPermission } from '../../shared/directives/if-has-permission';

export type MenuState = 'normal' | 'collapsed' | 'hidden';

@Component({
    selector: 'app-menu',
    imports: [AppIfHasPermission, RouterLink, RouterLinkActive],
    templateUrl: './menu.html',
    styleUrl: './menu.less'
})
export class Menu
{
    private readonly _menuState: WritableSignal<MenuState> = signal('normal');
    public readonly menuState: Signal<MenuState> = this._menuState.asReadonly();

    protected collapseMenu()
    {
        if (this._menuState() == 'normal')
            this._menuState.set('collapsed');
        else
            this._menuState.set('normal');
    }

    protected hideMenu()
    {
        if (this._menuState() == 'collapsed')
            this._menuState.set('hidden');
    }

    protected showMenu()
    {
        if (this._menuState() == 'hidden')
            this._menuState.set('collapsed');
    }
}
