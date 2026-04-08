import { Directive, inject, Input, TemplateRef, ViewContainerRef } from "@angular/core";
import { Subscription } from "rxjs";
import { Permission } from "../../core/domain/auth";
import { AuthService } from "../../core/services/auth-service";

@Directive(
    {
        selector: '[appIfHasPermission]',
        standalone: true,
    }
)
export class AppIfHasPermission
{
    private readonly authService: AuthService = inject(AuthService);
    private previousSubscription: Subscription | null = null;

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef)
    {}

    @Input() set appIfHasPermission(permission: Permission)
    {
        if (this.previousSubscription != null)
            this.previousSubscription.unsubscribe();

        this.previousSubscription = this.authService.currentAuthChange.subscribe(auth => {
            if (!auth.isAuthorized)
                this.viewContainer.clear();

            else if (auth.permissions.indexOf(permission) == -1)
                this.viewContainer.clear();

            // current user has permissions
            else if (this.viewContainer.length == 0)
                this.viewContainer.createEmbeddedView(this.templateRef);
        });
    }
}