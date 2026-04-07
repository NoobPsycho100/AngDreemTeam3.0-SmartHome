import { Component, inject, input, OnInit, output, Output } from '@angular/core';
import { UserRoomsStore, UserDevicesStore, RoomsService, DevicesService  } from '../../core/services/services';
import { DeviceModel, RoomModel } from '../../api/generated';
import { SpinnablePanel } from '../../shared/components/spinner/spinnable-panel';
import { KeyFilterPipe } from '../../shared/pipes/key-filter-pipe';
import { AppIfHasPermission } from '../../shared/directives/if-has-permission';

@Component({
    selector: 'room-card',
    imports: [SpinnablePanel, KeyFilterPipe, AppIfHasPermission],
    templateUrl: './room-card.html',
    styleUrl: './room-card.less'
})
export class RoomCard implements OnInit
{
    private readonly roomsService: RoomsService = inject(RoomsService);
    private readonly devicesService: DevicesService = inject(DevicesService);
    protected readonly roomsStore = inject(UserRoomsStore);
    protected readonly devicesStore = inject(UserDevicesStore);

    public editDevice = output<DeviceModel>();

    public room = input.required<RoomModel>();

    ngOnInit() {
        this.devicesService.ensureDevicesLoaded();
    }

    setDeviceOn(userDeviceId: number, event: Event)
    {
        const isOn = (event.target as HTMLInputElement).checked;
        this.devicesService.setDeviceOn(userDeviceId, isOn);
    }

    onEditDevice(device: DeviceModel)
    {
        this.editDevice.emit(device);
    }
}
