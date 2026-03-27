import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { map } from "rxjs";
import { AuthService } from "../../core/services/auth-service";
import { Permission } from "../../core/domain/auth";

export const authPermissionsGuardFactory: (reqPermission: Permission) => CanActivateFn =
(permission: Permission) =>
{
    return (route, state) =>
    {
        const authService = inject(AuthService);
        
        // Angular does not redirect by itself anywhere:
        //   https://angular.dev/guide/routing/route-guards#route-guard-return-types
        //   "Router uses the first emitted value and then unsubscribes"
        //   so we need to redirect to empty route after re-login
        return authService.currentAuthChange.pipe(map(x => {
            let isAuthorized = x.isAuthorized && x.permissions.indexOf(permission) != -1;
            return isAuthorized;
        }));
    };
}