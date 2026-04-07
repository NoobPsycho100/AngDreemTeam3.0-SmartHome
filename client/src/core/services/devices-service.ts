import { DevicesService as ApiDevicesService } from '../../api/generated/services';
import { inject, Injectable } from '@angular/core';
import { AuthStore } from './auth-store';
import { UserDevicesStore } from './devices-store';
import { DeviceTypesStore } from './devices-types-store';
import { map, Observable } from 'rxjs';
import { AddDeviceRequest, UpdateDeviceRequest } from '../../api/generated';

@Injectable({providedIn: 'root'})
export class DevicesService
{
    private readonly apiDevicesService = inject(ApiDevicesService);
    private readonly authStore = inject(AuthStore);
    private readonly devicesStore = inject(UserDevicesStore);
    private readonly devicestypesStore = inject(DeviceTypesStore);
    
    public constructor()
    {
        //this.devicesStore.changes$.subscribe(
        //    state => { console.log(state); }
        //);
    }

    public ensureDeviceTypesLoaded()
    {
        if (this.devicestypesStore.status() != 'not loaded')
            return;

        this.devicestypesStore.setLoading();

        let userId = this.authStore.auth()?.userId;
        this.apiDevicesService.apiDevicesDeviceTypesGet('body')
            .subscribe({
                next: types => {
                    this.devicestypesStore.setDeviceTypes(types);
                },
                error: error => {
                    this.devicestypesStore.setError();
                }
            });
    }

    public ensureDevicesLoaded()
    {
        if (this.devicesStore.status() != 'not loaded')
            return;

        this.reloadDevices();
    }

    public reloadDevices()
    {
        this.devicesStore.setLoading();

        let userId = this.authStore.auth()?.userId;
        this.apiDevicesService.apiDevicesMyDevicesGet('body')
            .subscribe({
                next: devices => {
                    this.devicesStore.setDevices(userId ?? 0, devices);
                },
                error: error => {
                    this.devicesStore.setError();
                }
            });
    }

    public setDeviceOn(userDeviceId: number, isOn: boolean)
    {
        const request = { userDeviceId, isOn };

        this.apiDevicesService.apiDevicesSetOnPost(request, 'body')
            .subscribe({
                next: () => {
                    this.devicesStore.setDeviceOn(userDeviceId, isOn);
                },
            });
    }

    public updateDevice(request: UpdateDeviceRequest): Observable<any>
    {
        return this.apiDevicesService.apiDevicesUpdateDevicePost(request, 'body')
            .pipe(map(() => {
                this.reloadDevices();
            }));
    }

    public addDevice(request: AddDeviceRequest): Observable<any>
    {
        return this.apiDevicesService.apiDevicesAddDevicePut(request, 'body')
            .pipe(map(() => {
                this.reloadDevices();
            }));
    }
};