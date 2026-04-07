import { RoomsService as ApiRoomsService } from '../../api/generated/services';
import { inject, Injectable } from '@angular/core';
import { AuthStore } from './auth-store';
import { UserRoomsStore } from './rooms-store';
import { map, Observable } from 'rxjs';
import { AddRoomRequest, UpdateRoomRequest } from '../../api/generated';
import { RoomsTypesStore } from './rooms-types-store';

@Injectable({providedIn: 'root'})
export class RoomsService
{
    private readonly apiRoomsService = inject(ApiRoomsService);
    private readonly authStore = inject(AuthStore);
    private readonly roomsStore = inject(UserRoomsStore);
    private readonly roomsTypesStore = inject(RoomsTypesStore);

    public constructor()
    {
        //this.roomsStore.changes$.subscribe(
        //    state => { console.log(state); }
        //);
    }

    public ensureRoomsTypesLoaded()
    {
        if (this.roomsTypesStore.status() != 'not loaded')
            return;

        this.reloadRoomsTypes();
    }

    public reloadRoomsTypes()
    {
        this.roomsTypesStore.setLoading();

        let userId = this.authStore.auth()?.userId;
        this.apiRoomsService.apiRoomsRoomsTypesGet('body')
            .subscribe({
                next: types => {
                    this.roomsTypesStore.setRoomTypes(types);
                },
                error: error => {
                    this.roomsTypesStore.setError();
                }
            });
    }

    public ensureRoomsLoaded()
    {
        if (this.roomsStore.status() != 'not loaded')
            return;

        this.reloadRooms();
    }

    public reloadRooms()
    {
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

    public updateRoom(request: UpdateRoomRequest): Observable<any>
    {
        return this.apiRoomsService.apiRoomsUpdateRoomPost(request, 'body')
            .pipe(map(() => {
                this.reloadRooms();
            }));
    }

    public addRoom(request: AddRoomRequest): Observable<any>
    {
        return this.apiRoomsService.apiRoomsAddRoomPut(request, 'body')
            .pipe(map(() => {
                this.reloadRooms();
            }));
    }    
};