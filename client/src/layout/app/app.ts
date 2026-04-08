import { Component, computed, viewChild, } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Menu } from '../menu/menu';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Header, Menu],
    templateUrl: './app.html',
    styleUrl: './app.less'
})
export class App {
    private menu = viewChild(Menu);
    protected menuState = computed(() => this.menu()?.menuState());
}
