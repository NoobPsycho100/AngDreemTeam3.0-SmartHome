import { Component, input } from '@angular/core';

@Component({
    selector: 'spinnable-panel',
    templateUrl: './spinnablePanel.html',
    styleUrl: './spinnablePanel.less',
    imports: []
})
export class SpinnablePanel
{
    public readonly showSpinner = input.required<boolean>();
}
