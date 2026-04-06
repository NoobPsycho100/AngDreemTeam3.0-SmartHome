import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { map } from "rxjs";
import { Permission } from "../../core/domain/auth";
import { AuthStore } from "../../core/services/auth-store";

export const authPermissionsGuardFactory: (reqPermission: Permission) => CanActivateFn =
(permission: Permission) =>
{
    return (route, state) =>
    {
        const authStore = inject(AuthStore);
        
        // Angular does not redirect by itself anywhere:
        //   https://angular.dev/guide/routing/route-guards#route-guard-return-types
        //   "Router uses the first emitted value and then unsubscribes"
        //   so we need to redirect to empty route after re-login
        return authStore.changes$.pipe(map(x => {
            let isAuthorized = x.status == 'authorized' && x.auth?.permissions.indexOf(permission) != -1;
            return isAuthorized;
        }));
    };
}