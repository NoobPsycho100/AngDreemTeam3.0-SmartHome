import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'keyFilter',
})
export class KeyFilterPipe implements PipeTransform {
    transform(value: any[], keyPattern: any): any[] {
        return value.filter(x => {
            for (let key in keyPattern)
            {
                if (x[key] != keyPattern[key])
                    return false;
            }
            return true;
        });
    }
}