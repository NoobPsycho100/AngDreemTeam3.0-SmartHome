import { RoomsService as ApiRoomsService } from '../../api/generated/services';
import { inject, Injectable } from '@angular/core';
import { AuthStore } from './auth-store';
import { UserRoomsStore } from './rooms-store';

@Injectable({providedIn: 'root'})
export class RoomsService
{
    private readonly apiRoomsService = inject(ApiRoomsService);
    private readonly authStore = inject(AuthStore);
    private readonly roomsStore = inject(UserRoomsStore);

    public constructor()
    {
        //this.roomsStore.changes$.subscribe(
        //    state => { console.log(state); }
        //);
    }

    public ensureRoomsLoaded()
    {
        if (this.roomsStore.status() != 'not loaded')
            return;

        this.roomsStore.setLoading();

        let userId = this.authStore.auth()?.userId;
        this.apiRoomsService.apiRoomsMyRoomsGet('body')
            .subscribe({
                next: rooms => {
                    this.roomsStore.setRooms(userId ?? 0, rooms);
                },
                error: error => {
                    this.roomsStore.setError();
                },
            });
    }
};