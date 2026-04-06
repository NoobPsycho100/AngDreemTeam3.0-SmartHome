import { Directive, inject, Input, TemplateRef, ViewContainerRef } from "@angular/core";
import { Subscription } from "rxjs";
import { Permission } from "../../core/domain/auth";
import { AuthStore } from "../../core/services/auth-store";

@Directive(
    {
        selector: '[appIfHasPermission]',
        standalone: true,
    }
)
export class AppIfHasPermission
{
    private readonly authStore = inject(AuthStore);
    
    private previousSubscription: Subscription | null = null;

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef)
    {}

    @Input() set appIfHasPermission(permission: Permission)
    {
        if (this.previousSubscription != null)
            this.previousSubscription.unsubscribe();

        this.previousSubscription = this.authStore.changes$.subscribe(auth => {
            if (auth.status != 'authorized')
                this.viewContainer.clear();

            else if (auth.auth?.permissions.indexOf(permission) == -1)
                this.viewContainer.clear();

            // current user has permissions
            else if (this.viewContainer.length == 0)
                this.viewContainer.createEmbeddedView(this.templateRef);
        });
    }
}