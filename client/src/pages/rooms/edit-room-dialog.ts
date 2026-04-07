import { Component, ElementRef, HostListener, inject, model, signal, viewChild } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { NullValidationErrorResult, ValidationErrorResult } from '../../core/models/response';
import { RoomsService, RoomsTypesStore } from '../../core/services/services';
import { AddRoomRequest, RoomModel, UpdateRoomRequest } from '../../api/generated/models';
import { ServerValidationErrors } from '../../shared/components/errors/server-validation-error';
import { AppIfHasPermission } from '../../shared/directives/if-has-permission';
import { ClientValidationErrors } from '../../shared/components/errors/client-validation-error';
import { SpinnablePanel } from '../../shared/components/spinner/spinnable-panel';

export type EditRoomMode = 'edit' | 'add';

interface EditRoomModel {
    userRoomId?: number;
    roomTypeId: string;
    roomName: string;
    comment: string;
    roomSize: number;
}

const EmptyRoomModel: EditRoomModel = 
{
    roomTypeId: '',
    roomName: '',
    comment: '',
    roomSize: 0,
}

@Component({
    selector: 'edit-room-dialog',
    templateUrl: './edit-room-dialog.html',
    styleUrl: './edit-room-dialog.less',
    imports: [FormField, ServerValidationErrors, ClientValidationErrors, AppIfHasPermission, SpinnablePanel]
})
export class EditRoomDialog
{
    private readonly roomsService: RoomsService = inject(RoomsService);
    protected readonly roomTypesStore = inject(RoomsTypesStore);

    public readonly mode = model<EditRoomMode>('add');
    protected readonly serverErrors = signal(NullValidationErrorResult);
    protected readonly spinner = signal(false);

    private dialog = viewChild<ElementRef<HTMLDialogElement>>("roomDialog");

    private roomModel = signal<EditRoomModel>(EmptyRoomModel);

    protected roomForm = form(this.roomModel, (schema) => {
        required(schema.roomTypeId, {message: 'Room type is required'});
    });

    protected addRoom()
    {
        if (!this.roomForm().valid())
            return;

        this.spinner.set(true);
        let request: AddRoomRequest = {
            roomTypeId: parseInt(this.roomModel().roomTypeId),
            roomName: this.makeNullable(this.roomModel().roomName),
            comment: this.makeNullable(this.roomModel().comment),
            roomSize: this.makeNullableNumber(this.roomModel().roomSize),
        };
        this.roomsService.addRoom(request)
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

    protected updateRoom()
    {
        if (!this.roomForm().valid())
            return;

        this.spinner.set(true);
        let request: UpdateRoomRequest = {
            userRoomId: this.roomModel().userRoomId,
            roomTypeId: parseInt(this.roomModel().roomTypeId),
            roomName: this.makeNullable(this.roomModel().roomName),
            comment: this.makeNullable(this.roomModel().comment),
            roomSize: this.makeNullableNumber(this.roomModel().roomSize),
        };
        this.roomsService.updateRoom(request)
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

    public showEditDialog(room: RoomModel)
    {
        this.roomsService.ensureRoomsTypesLoaded();

        this.mode.set('edit');
        this.serverErrors.set(NullValidationErrorResult);
        this.spinner.set(false);

        this.roomModel.set({
            userRoomId: room.userRoomId,
            roomTypeId: room.roomTypeId.toString(),
            roomName: room.roomName ?? '',
            comment: room.comment ?? '',
            roomSize: room.roomSize ?? 0,
        });
        
        this.dialog()?.nativeElement.showModal();
    }

    public showAddDialog()
    {
        this.roomsService.ensureRoomsTypesLoaded();

        this.mode.set('add');
        this.serverErrors.set(NullValidationErrorResult);
        this.spinner.set(false);

        this.roomModel.set(EmptyRoomModel);
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

    private makeNullable(value: string): string | null
    {
        if (!value || value.trim() == '')
            return null;
        return value;
    }

    private makeNullableNumber(value: number): number | null
    {
        if (value == 0)
            return null;
        return value;
    }
}
