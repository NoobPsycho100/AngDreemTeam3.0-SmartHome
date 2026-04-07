import { DevicesService as ApiDevicesService } from '../../api/generated/services';
import { inject, Injectable } from '@angular/core';
import { AuthStore } from './auth-store';
import { UserDevicesStore } from './devices-store';

@Injectable({providedIn: 'root'})
export class DevicesService
{
    private readonly apiDevicesService = inject(ApiDevicesService);
    private readonly authStore = inject(AuthStore);
    private readonly devicesStore = inject(UserDevicesStore);
    
    public constructor()
    {
        //this.devicesStore.changes$.subscribe(
        //    state => { console.log(state); }
        //);
    }

    public ensureDevicesLoaded()
    {
        if (this.devicesStore.status() != 'not loaded')
            return;

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
};