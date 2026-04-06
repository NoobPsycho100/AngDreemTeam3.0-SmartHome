import { signalStore, withState, withMethods, patchState, withHooks, withProps, withComputed } from '@ngrx/signals';
import { Permission, Role } from '../domain/auth';
import { toObservable } from '@angular/core/rxjs-interop';
import { computed } from '@angular/core';

export interface Auth
{
    readonly login: string;
    readonly token: string;
    readonly roles: Role[];
    readonly permissions: Permission[];
}
export interface AuthData
{
    readonly status: 'authorized' | 'unauthorized' | 'loading';
    readonly auth: Auth | null;
}

export const Unauthorized: AuthData = { status: 'unauthorized', auth: null };

const LocalAuthKey: string = 'local-auth';

// Create the SignalStore
export const AuthStore = signalStore(
    { providedIn: 'root' },
    withState(Unauthorized),
    withComputed(store => ({
        fullState: () => { return { auth: store.auth(), status: store.status() } },
    })),
    withProps(store => ({
        changes$: toObservable(store.fullState),
        authChanges$: toObservable(store.auth),
        statusChanges$: toObservable(store.status),
    })),
    withMethods((store) => ({
        logout() {
            localStorage.removeItem(LocalAuthKey);
            patchState(store, Unauthorized);
        },
        loadAuthFromLocal(){
            let token = localStorage.getItem(LocalAuthKey);
            this.setAuthToken(token);
        },
        setAuthToken(token: string | null){
            if (!token)
            {
                this.logout();
                return ;
            }

            let tokenData = atob(token.split('.')[1]);
            let userData = JSON.parse(tokenData);
            let auth: Auth = { login: userData.Login, token: token, roles: userData.Roles, permissions: userData.Permissions };
            let authData: AuthData = { status: 'authorized', auth: auth };
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

