import { Component, inject, OnInit, viewChild } from '@angular/core';
import { UserRoomsStore, RoomsService } from '../../core/services/services';
import { RoomCard } from './room-card';
import { DeviceModel, RoomModel } from '../../api/generated';
import { EditDeviceDialog } from '../devices/edit-device-dialog';
import { EditRoomDialog } from './edit-room-dialog';

@Component({
    selector: 'rooms',
    imports: [RoomCard, EditDeviceDialog, EditRoomDialog],
    templateUrl: './rooms.html',
    styleUrl: './rooms.less'
})
export class RoomsPage implements OnInit
{
    private readonly roomsService: RoomsService = inject(RoomsService);
    protected readonly roomsStore = inject(UserRoomsStore);

    private editDeviceDialog = viewChild<EditDeviceDialog>("editDeviceDialog");
    private editRoomDialog = viewChild<EditRoomDialog>("editRoomDialog");

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
    
    onEditRoom(room: RoomModel)
    {
        this.editRoomDialog()?.showEditDialog(room);
    }
    
    onAddRoom()
    {
        this.editRoomDialog()?.showAddDialog();
    }
}
