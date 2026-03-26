import { Component, Signal, signal, WritableSignal } from '@angular/core';

export type MenuState = 'normal' | 'collapsed' | 'hidden';

@Component({
  selector: 'app-menu',
  imports: [],
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
