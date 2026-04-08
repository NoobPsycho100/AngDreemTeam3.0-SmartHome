import { NgTemplateOutlet } from '@angular/common';
import { Component, Input, input, TemplateRef } from '@angular/core';
import { FieldState } from '@angular/forms/signals';

@Component({
    selector: 'client-validation-error',
    templateUrl: './client-validation-error.html',
    imports: [NgTemplateOutlet]
})
export class ClientValidationErrors
{
    @Input()
    public errorTemplate!: TemplateRef<any>;
    
    public readonly fieldState = input.required<FieldState<any, string>>();
}
