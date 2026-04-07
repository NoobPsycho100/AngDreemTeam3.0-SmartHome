import { Component, inject, OnInit } from '@angular/core';
import { UserRoomsStore, RoomsService } from '../../core/services/services';
import { RoomCard } from './room-card';

@Component({
    selector: 'rooms',
    imports: [RoomCard],
    templateUrl: './rooms.html',
    styleUrl: './rooms.less'
})
export class RoomsPage implements OnInit
{
    private readonly roomsService: RoomsService = inject(RoomsService);
    protected readonly roomsStore = inject(UserRoomsStore);

    ngOnInit() {
        this.roomsService.ensureRoomsLoaded();
    }
}
