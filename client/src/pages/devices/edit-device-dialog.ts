import { Component, ElementRef, HostListener, inject, model, signal, viewChild } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { NullValidationErrorResult, ValidationErrorResult } from '../../core/models/response';
import { DevicesService, DeviceTypesStore, UserDevicesStore, UserRoomsStore } from '../../core/services/services';
import { DeviceModel, UpdateDeviceRequest } from '../../api/generated/models';
import { ServerValidationErrors } from '../../shared/components/errors/server-validation-error';
import { AppIfHasPermission } from '../../shared/directives/if-has-permission';
import { ClientValidationErrors } from '../../shared/components/errors/client-validation-error';
import { SpinnablePanel } from '../../shared/components/spinner/spinnable-panel';
import { MultiTagsSelector } from '../../shared/components/tags/multi-tags-selector';

export type EditDeviceMode = 'edit' | 'add';

interface EditDeviceModel {
    userDeviceId?: number;
    deviceTypeId: string;
    userRoomId: string;
    deviceName: string;
    comment: string;
    indicatorColor: string;
    deviceIcon: string;
    customTags: Array<string>;
    isOn: boolean;
}
const EmptyDeviceModel: EditDeviceModel = 
{
    deviceTypeId: '',
    userRoomId: '',
    deviceName: '',
    comment: '',
    indicatorColor: '',
    deviceIcon: "icons/devices/light.png",
    customTags: [],
    isOn: true,
}

@Component({
    selector: 'edit-device-dialog',
    templateUrl: './edit-device-dialog.html',
    styleUrl: './edit-device-dialog.less',
    imports: [FormField, ServerValidationErrors, ClientValidationErrors, AppIfHasPermission, SpinnablePanel, MultiTagsSelector]
})
export class EditDeviceDialog
{
    private readonly devicesService: DevicesService = inject(DevicesService);
    protected readonly roomsStore = inject(UserRoomsStore);
    protected readonly devicesStore = inject(UserDevicesStore);
    protected readonly devicesTypesStore = inject(DeviceTypesStore);

    public readonly mode = model<EditDeviceMode>('add');
    protected readonly serverErrors = signal(NullValidationErrorResult);
    protected readonly spinner = signal(false);

    private dialog = viewChild<ElementRef<HTMLDialogElement>>("deviceDialog");

    private deviceModel = signal<EditDeviceModel>(EmptyDeviceModel);

    protected deviceForm = form(this.deviceModel, (schema) => {
        required(schema.deviceTypeId, {message: 'Device type is required'});
        required(schema.userRoomId, {message: 'Room is required'});
    });

    protected addDevice()
    {

    }

    protected updateDevice()
    {
        if (!this.deviceForm().valid())
            return;

        this.spinner.set(true);
        let request: UpdateDeviceRequest = {
            userDeviceId: this.deviceModel().userDeviceId,
            deviceTypeId: parseInt(this.deviceModel().deviceTypeId),
            userRoomId: parseInt(this.deviceModel().userRoomId),
            deviceName: this.deviceModel().deviceName,
            comment: this.deviceModel().comment,
            indicatorColor: this.deviceModel().indicatorColor,
            deviceIcon: this.deviceModel().deviceIcon,
            customTags: this.deviceModel().customTags,
            isOn: this.deviceModel().isOn,
        };
        this.devicesService.updateDevice(request)
            .subscribe({
                next: () =>
                {
                    this.serverErrors.set(NullValidationErrorResult);
                    this.spinner.set(false);
                    this.closeDialog();
                },
                error: error =>
                {
                    if (error instanceof ValidationErrorResult)
                        this.serverErrors.set(error);
                    this.spinner.set(false);
                }
            });
    }

    public showDialog(mode: EditDeviceMode, device: DeviceModel)
    {
        this.devicesService.ensureDeviceTypesLoaded();
        this.mode.set(mode);
        this.serverErrors.set(NullValidationErrorResult);
        this.spinner.set(false);

        if (mode == 'edit')
        {
            this.deviceModel.set({
                userDeviceId: device.userDeviceId,
                deviceTypeId: device.deviceTypeId.toString(),
                userRoomId: device.userRoomId.toString(),
                deviceName: device.deviceName ?? '',
                comment: device.comment ?? '',
                indicatorColor: device.indicatorColor ?? '',
                deviceIcon: device.deviceIcon ?? '',
                customTags: device.customTags,
                isOn: device.isOn,
            });
        }
        if (mode == 'add')
        {
            this.deviceModel.set(EmptyDeviceModel);
        }
        this.dialog()?.nativeElement.showModal();
    }

    public closeDialog()
    {
        this.dialog()?.nativeElement.close();
    }

    @HostListener("window:keydown.escape") 
    protected onClick()
    {
        this.closeDialog();
    }
}
