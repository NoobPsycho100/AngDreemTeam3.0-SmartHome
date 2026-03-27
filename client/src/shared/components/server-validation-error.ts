import { Component, computed, input } from '@angular/core';
import { ValidationErrorResult } from '../../core/models/response';

@Component({
    selector: 'server-validation-error',
    templateUrl: './server-validation-error.html',
    imports: []
})
export class ServerValidationErrors
{
    public readonly serverErrors = input.required<ValidationErrorResult>();
    public readonly forField = input<string>();
    
    protected readonly showErrors = computed(() => {
        let errors = this.serverErrors();
        let field = this.forField();
        
        let shownErrors = errors.validationErrors.filter(x => !field || x.key.toUpperCase() == field.toUpperCase()).map(x => x.error);
        
        return shownErrors.join('<br/>');
    });
}
