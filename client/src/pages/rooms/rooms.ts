import { Component, inject, OnInit, viewChild } from '@angular/core';
import { UserRoomsStore, RoomsService } from '../../core/services/services';
import { RoomCard } from './room-card';
import { DeviceModel } from '../../api/generated';
import { EditDeviceDialog } from '../devices/edit-device-dialog';

@Component({
    selector: 'rooms',
    imports: [RoomCard, EditDeviceDialog],
    templateUrl: './rooms.html',
    styleUrl: './rooms.less'
})
export class RoomsPage implements OnInit
{
    private readonly roomsService: RoomsService = inject(RoomsService);
    protected readonly roomsStore = inject(UserRoomsStore);

    private editDeviceDialog = viewChild<EditDeviceDialog>("editDeviceDialog");

    ngOnInit()
    {
        this.roomsService.ensureRoomsLoaded();
    }
    
    onEditDevice(device: DeviceModel)
    {
        this.editDeviceDialog()?.showEditDialog(device);
    }
    
    onAddDevice(roomId?: number)
    {
        this.editDeviceDialog()?.showAddDialog(roomId);
    }
}
