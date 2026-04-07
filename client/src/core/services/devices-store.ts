import { signalStore, withState, withMethods, patchState, withHooks, withProps, withComputed, watchState } from '@ngrx/signals';
import { toObservable } from '@angular/core/rxjs-interop';
import { DeviceModel } from '../../api/generated';
import { inject } from '@angular/core';
import { AuthStore } from './auth-store';

export interface UserDevicesData
{
    readonly status: 'not loaded' | 'loaded' | 'loading';
    readonly userId: number;
    readonly devices: DeviceModel[];
}

export const UserDevicesStore = signalStore(
    { providedIn: 'root' },
    withState<UserDevicesData>({ userId: 0, status: 'not loaded', devices: [] }),
    withComputed(store => ({
        fullState: () => { return { status: store.status(), userId: store.userId(), devices: store.devices(), } },
    })),
    withProps(store => ({
        changes$: toObservable(store.fullState),
        devicesChanges$: toObservable(store.devices),
        statusChanges$: toObservable(store.status),
    })),
    withMethods((store) => ({
        changeCurrentUser(userId?: number) {
            if (!userId)
                patchState(store, { userId: 0, status: 'not loaded', devices: [] });

            else if (store.userId() != userId)
                patchState(store, { userId: userId, status: 'not loaded', devices: [] });
        },
        setDevices(userId: number, devices: DeviceModel[]){
            patchState(store, { userId: userId, status: 'loaded', devices: devices });
        },
        setLoading(){
            patchState(store, { status: 'loading' });
        },
        setError(){
            patchState(store, { status: 'not loaded' });
        }
    })),
    withHooks((store, authStore = inject(AuthStore)) => ({
        onInit() {
            authStore.authChanges$.subscribe(auth => store.changeCurrentUser(auth?.userId));
        },
    })
));

