import { signalStore, withState, withMethods, patchState, withHooks, withProps, withComputed } from '@ngrx/signals';
import { Permission, Role } from '../domain/auth';
import { toObservable } from '@angular/core/rxjs-interop';

export interface Auth
{
    readonly userId: number;
    readonly login: string;
    readonly token: string;
    readonly roles: Role[];
    readonly permissions: Permission[];
}
export interface AuthData
{
    readonly status: 'authorized' | 'unauthorized' | 'loading';
    readonly initState: boolean;
    readonly auth: Auth | null;
}

const LocalAuthKey: string = 'local-auth';

export const AuthStore = signalStore(
    { providedIn: 'root' },
    withState<AuthData>({ status: 'unauthorized', initState: true, auth: null }),
    withComputed(store => ({
        fullState: () => { return { auth: store.auth(), status: store.status(), initState: store.initState() } },
    })),
    withProps(store => ({
        changes$: toObservable(store.fullState),
        authChanges$: toObservable(store.auth),
        statusChanges$: toObservable(store.status),
    })),
    withMethods((store) => ({
        logout() {
            localStorage.removeItem(LocalAuthKey);
            patchState(store, { status: 'unauthorized', initState: false, auth: null });
        },
        loadAuthFromLocal(){
            let token = localStorage.getItem(LocalAuthKey);
            this.setAuthToken(token, true);
        },
        setAuthToken(token: string | null, initState: boolean = false){
            if (!token)
            {
                this.logout();
                return ;
            }

            let tokenData = atob(token.split('.')[1]);
            let userData = JSON.parse(tokenData);
            let auth: Auth = { userId: userData.UserId, login: userData.Login, token: token, roles: userData.Roles, permissions: userData.Permissions };
            let authData: AuthData = { status: 'authorized', initState: initState, auth: auth };
            patchState(store, authData);
        
            localStorage.setItem(LocalAuthKey, token);
        },
        setLoading(){
            patchState(store, { status: 'loading' });
        },
        setError(){
            patchState(store, { status: 'unauthorized' });
        }
    })),
    withHooks(store => ({
        onInit() {
            store.loadAuthFromLocal();
        },
    })
));

