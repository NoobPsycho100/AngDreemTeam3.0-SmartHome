import { signalStore, withState, withMethods, patchState, withHooks, withProps, withComputed, watchState } from '@ngrx/signals';
import { toObservable } from '@angular/core/rxjs-interop';
import { RoomModel } from '../../api/generated';
import { inject } from '@angular/core';
import { AuthStore } from './auth-store';

export interface UserRoomsData
{
    readonly status: 'not loaded' | 'loaded' | 'loading';
    readonly userId: number;
    readonly rooms: RoomModel[];
}

export const UserRoomsStore = signalStore(
    { providedIn: 'root' },
    withState<UserRoomsData>({ userId: 0, status: 'not loaded', rooms: [] }),
    withComputed(store => ({
        fullState: () => { return { status: store.status(), userId: store.userId(), rooms: store.rooms(), } },
    })),
    withProps(store => ({
        changes$: toObservable(store.fullState),
        roomsChanges$: toObservable(store.rooms),
        statusChanges$: toObservable(store.status),
    })),
    withMethods((store) => ({
        changeCurrentUser(userId?: number) {
            if (!userId)
                patchState(store, { userId: 0, status: 'not loaded', rooms: [] });

            else if (store.userId() != userId)
                patchState(store, { userId: userId, status: 'not loaded', rooms: [] });
        },
        setRooms(userId: number, rooms: RoomModel[]){
            patchState(store, { userId: userId, status: 'loaded', rooms: rooms });
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

