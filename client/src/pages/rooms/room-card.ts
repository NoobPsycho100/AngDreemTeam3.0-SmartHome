import { Component, inject, input, OnInit } from '@angular/core';
import { UserRoomsStore, UserDevicesStore, RoomsService, DevicesService  } from '../../core/services/services';
import { RoomModel } from '../../api/generated';
import { SpinnablePanel } from '../../shared/components/spinner/spinnable-panel';
import { KeyFilterPipe } from '../../shared/pipes/key-filter-pipe';

@Component({
    selector: 'room-card',
    imports: [SpinnablePanel, KeyFilterPipe],
    templateUrl: './room-card.html',
    styleUrl: './room-card.less'
})
export class RoomCard implements OnInit
{
    private readonly roomsService: RoomsService = inject(RoomsService);
    private readonly devicesService: DevicesService = inject(DevicesService);
    protected readonly roomsStore = inject(UserRoomsStore);
    protected readonly devicesStore = inject(UserDevicesStore);

    public room = input.required<RoomModel>();

    ngOnInit() {
        this.devicesService.ensureDevicesLoaded();
    }
}
