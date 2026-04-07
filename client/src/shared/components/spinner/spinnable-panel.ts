import { Component, input } from '@angular/core';

@Component({
    selector: 'spinnable-panel',
    templateUrl: './spinnable-panel.html',
    styleUrl: './spinnable-panel.less',
    imports: []
})
export class SpinnablePanel
{
    public readonly showSpinner = input.required<boolean>();
}
